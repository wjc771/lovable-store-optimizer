import { supabase } from '@/integrations/supabase/client';
import { indexedDB } from './indexedDB';
import { v4 as uuidv4 } from 'uuid';
import validationService from './validationService';
import { schemas } from './validationService';

type TableName = keyof typeof schemas | 'positions' | 'staff';
type ValidatedTableName = keyof typeof schemas;

export type ErrorType = 'network' | 'validation' | 'authorization' | 'conflict' | 'unknown';

export interface SyncQueueItem {
  clientId: string;
  operationType: 'create' | 'update' | 'delete';
  tableName: TableName;
  recordId?: string;
  data: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attemptCount: number;
  errorMessage?: string;
  errorType?: ErrorType;
  errorDetails?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  lastRetryAt?: Date;
}

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_BASE = 2000; // Base delay in milliseconds

class SyncService {
  private isOnline: boolean = navigator.onLine;
  private syncInProgress: boolean = false;

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingItems();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private calculateRetryDelay(attemptCount: number): number {
    return Math.min(RETRY_DELAY_BASE * Math.pow(2, attemptCount), 30000);
  }

  private async validateOperation(item: SyncQueueItem): Promise<boolean> {
    if (item.operationType === 'delete') return true;

    // Check if the table has a validation schema
    if (!Object.keys(schemas).includes(item.tableName)) {
      return true;
    }

    // Type assertion since we've verified the table name is valid
    const validatedTableName = item.tableName as ValidatedTableName;

    // Validate data structure
    const validationResult = validationService.validateRecord(
      validatedTableName,
      item.data
    );

    if (!validationResult.success) {
      throw new Error(`Validation failed: ${validationResult.errors?.toString()}`);
    }

    // Validate relationships
    const relationshipResult = await validationService.validateRelationships(
      validatedTableName,
      item.data
    );

    if (!relationshipResult.success) {
      throw new Error(`Relationship validation failed: ${relationshipResult.errors?.toString()}`);
    }

    // Validate data integrity
    const integrityResult = validationService.validateDataIntegrity(
      validatedTableName,
      item.data
    );

    if (!integrityResult.success) {
      throw new Error(`Data integrity validation failed: ${integrityResult.errors?.toString()}`);
    }

    return true;
  }

  private async logSyncEvent(queueItem: SyncQueueItem, eventType: string, status: string, details: any = {}, durationMs?: number) {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return;

      await supabase.from('sync_events').insert({
        sync_queue_id: queueItem.clientId,
        user_id: user.data.user.id,
        event_type: eventType,
        status: status,
        details: details,
        duration_ms: durationMs
      });
    } catch (error) {
      console.error('Failed to log sync event:', error);
    }
  }

  private classifyError(error: any): ErrorType {
    if (!navigator.onLine) return 'network';
    if (error?.status === 401 || error?.status === 403) return 'authorization';
    if (error?.status === 409) return 'conflict';
    if (error?.status === 400 || error?.status === 422) return 'validation';
    return 'unknown';
  }

  private async checkForConflicts(item: SyncQueueItem): Promise<boolean> {
    if (item.operationType !== 'update' || !item.recordId) return false;

    const { data: serverRecord } = await supabase
      .from(item.tableName)
      .select('*')
      .eq('id', item.recordId)
      .single();

    if (!serverRecord) return false;

    // Only check version if both records have version property
    const clientVersion = item.data.version || 1;
    const serverVersion = (serverRecord as any).version || 1;
    
    if (serverVersion > clientVersion) {
      const user = await supabase.auth.getUser();
      if (!user.data.user) return false;

      // Log the conflict
      await supabase.from('sync_conflicts').insert({
        user_id: user.data.user.id,
        table_name: item.tableName,
        record_id: item.recordId,
        sync_queue_id: item.clientId,
        client_data: item.data,
        server_data: serverRecord,
        resolution_status: 'pending'
      });

      return true;
    }

    return false;
  }

  async queueOperation(operation: Omit<SyncQueueItem, 'clientId' | 'status' | 'attemptCount' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const syncItem: SyncQueueItem = {
      ...operation,
      clientId: uuidv4(),
      status: 'pending',
      attemptCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      // Validate the operation before queueing
      await this.validateOperation(syncItem);

      await indexedDB.add('syncQueue', syncItem);
      await this.logSyncEvent(syncItem, 'operation_queued', 'pending');

      if (this.isOnline) {
        this.syncPendingItems();
      }
    } catch (error) {
      console.error('Validation error:', error);
      const validationError = {
        ...operation,
        clientId: syncItem.clientId,
        status: 'failed' as const,
        attemptCount: 1,
        errorType: 'validation' as const,
        errorMessage: error.message,
        errorDetails: {
          validation: error.toString(),
          timestamp: new Date().toISOString()
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await indexedDB.add('syncQueue', validationError);
      await this.logSyncEvent(validationError, 'validation_failed', 'error', {
        error_message: error.message
      });
    }
  }

  async syncPendingItems(): Promise<void> {
    if (this.syncInProgress) return;
    this.syncInProgress = true;

    try {
      const pendingItems = await indexedDB.getAll<SyncQueueItem>('syncQueue');
      const itemsToSync = pendingItems.filter(item => 
        item.status === 'pending' || 
        (item.status === 'failed' && item.attemptCount < MAX_RETRY_ATTEMPTS)
      );

      for (const item of itemsToSync) {
        const startTime = Date.now();
        try {
          item.status = 'processing';
          item.updatedAt = new Date();
          await indexedDB.update('syncQueue', item.clientId, item);

          // Check for conflicts before performing the operation
          const hasConflict = await this.checkForConflicts(item);
          if (hasConflict) {
            item.status = 'failed';
            item.errorType = 'conflict';
            item.errorMessage = 'Data conflict detected - requires manual resolution';
            item.updatedAt = new Date();
            await indexedDB.update('syncQueue', item.clientId, item);
            continue;
          }

          const { error } = await this.performServerOperation(item);

          if (error) throw error;

          item.status = 'completed';
          await indexedDB.update('syncQueue', item.clientId, item);
          
          const duration = Date.now() - startTime;
          await this.logSyncEvent(item, 'sync_completed', 'success', {}, duration);

        } catch (error) {
          console.error('Sync error:', error);
          
          item.status = 'failed';
          item.attemptCount += 1;
          item.errorType = this.classifyError(error);
          item.errorMessage = error.message;
          item.errorDetails = { 
            stack: error.stack,
            context: error.context || {},
            timestamp: new Date().toISOString()
          };
          item.lastRetryAt = new Date();
          item.updatedAt = new Date();
          
          await indexedDB.update('syncQueue', item.clientId, item);
          
          const duration = Date.now() - startTime;
          await this.logSyncEvent(
            item, 
            'sync_failed', 
            'error',
            {
              error_type: item.errorType,
              error_message: item.errorMessage,
              attempt: item.attemptCount
            },
            duration
          );

          if (item.attemptCount < MAX_RETRY_ATTEMPTS) {
            const delay = this.calculateRetryDelay(item.attemptCount);
            setTimeout(() => this.syncPendingItems(), delay);
          }
        }
      }
    } finally {
      this.syncInProgress = false;
    }
  }

  async retryFailedOperation(clientId: string): Promise<void> {
    const item = await indexedDB.get<SyncQueueItem>('syncQueue', clientId);
    if (item && item.status === 'failed') {
      item.status = 'pending';
      item.updatedAt = new Date();
      await indexedDB.update('syncQueue', clientId, item);
      await this.logSyncEvent(item, 'manual_retry_initiated', 'pending');
      if (this.isOnline) {
        this.syncPendingItems();
      }
    }
  }

  private async performServerOperation(item: SyncQueueItem) {
    const { operationType, tableName, data, recordId } = item;

    switch (operationType) {
      case 'create':
        return await supabase.from(tableName).insert(data);

      case 'update':
        return await supabase.from(tableName).update(data).eq('id', recordId);

      case 'delete':
        return await supabase.from(tableName).delete().eq('id', recordId);

      default:
        throw new Error(`Unknown operation type: ${operationType}`);
    }
  }
}

export const syncService = new SyncService();
