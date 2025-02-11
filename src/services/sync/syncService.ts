import { supabase } from '@/integrations/supabase/client';
import { indexedDB } from '../indexedDB';
import { v4 as uuidv4 } from 'uuid';
import { SyncQueueItem, ErrorType, ValidTableName, RecordData, isRecordData } from './types';
import { CompressionService } from './compressionService';
import { networkMonitor } from './networkMonitor';
import { syncMetadataService } from './syncMetadataService';

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_BASE = 2000;

class SyncService {
  private syncInProgress: boolean = false;

  constructor() {
    networkMonitor.addListener(() => {
      if (networkMonitor.isNetworkOnline()) {
        this.syncPendingItems();
      }
    });
  }

  private calculateRetryDelay(attemptCount: number): number {
    return Math.min(RETRY_DELAY_BASE * Math.pow(2, attemptCount), 30000);
  }

  private classifyError(error: any): ErrorType {
    if (!networkMonitor.isNetworkOnline()) return 'network';
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

    const clientVersion = (item.data as RecordData).version || 1;
    const serverVersion = (serverRecord as any).version || 1;
    
    if (serverVersion > clientVersion) {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;

      await supabase.from('sync_conflicts').insert({
        user_id: user.user.id,
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
    const startTime = Date.now();
    const { compressedData, algorithm } = await CompressionService.compressData(operation.data);

    const syncItem: SyncQueueItem = {
      ...operation,
      clientId: uuidv4(),
      status: 'pending',
      attemptCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      compressedData,
      compressionAlgorithm: algorithm
    };

    try {
      await indexedDB.add('syncQueue', syncItem);
      
      const endTime = Date.now();
      await syncMetadataService.recordSyncAnalytics({
        sync_type: 'queue',
        operation_count: 1,
        success_count: 1,
        error_count: 0,
        total_time_ms: endTime - startTime,
        avg_operation_time_ms: endTime - startTime,
        network_info: networkMonitor.getNetworkInfo(),
        error_details: {}
      });

      if (networkMonitor.isNetworkOnline()) {
        this.syncPendingItems();
      }
    } catch (error) {
      console.error('Error:', error);
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
        try {
          item.status = 'processing';
          item.updatedAt = new Date();
          await indexedDB.update('syncQueue', item.clientId, item);

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

  async retryFailedOperation(clientId: string): Promise<void> {
    const item = await indexedDB.get<SyncQueueItem>('syncQueue', clientId);
    if (item && item.status === 'failed') {
      item.status = 'pending';
      item.updatedAt = new Date();
      await indexedDB.update('syncQueue', clientId, item);
      if (networkMonitor.isNetworkOnline()) {
        this.syncPendingItems();
      }
    }
  }
}

export const syncService = new SyncService();
