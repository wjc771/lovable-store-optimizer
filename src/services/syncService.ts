
import { supabase } from '@/integrations/supabase/client';
import { indexedDB } from './indexedDB';
import { v4 as uuidv4 } from 'uuid';

type TableName = 'sales' | 'customers' | 'orders' | 'tasks' | 'products';

export interface SyncQueueItem {
  clientId: string;
  operationType: 'create' | 'update' | 'delete';
  tableName: TableName;
  recordId?: string;
  data: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attemptCount: number;
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

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

  async queueOperation(operation: Omit<SyncQueueItem, 'clientId' | 'status' | 'attemptCount' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const syncItem: SyncQueueItem = {
      ...operation,
      clientId: uuidv4(),
      status: 'pending',
      attemptCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await indexedDB.add('syncQueue', syncItem);

    if (this.isOnline) {
      this.syncPendingItems();
    }
  }

  private async syncPendingItems() {
    if (this.syncInProgress) return;
    this.syncInProgress = true;

    try {
      const pendingItems = await indexedDB.getAll<SyncQueueItem>('syncQueue');
      const itemsToSync = pendingItems.filter(item => item.status === 'pending');
      const user = await supabase.auth.getUser();

      if (!user.data.user) {
        throw new Error('User not authenticated');
      }

      for (const item of itemsToSync) {
        try {
          item.status = 'processing';
          item.updatedAt = new Date();
          await indexedDB.update('syncQueue', item.clientId, item);

          const { error } = await this.performServerOperation(item);

          if (error) {
            throw error;
          }

          item.status = 'completed';
          await indexedDB.update('syncQueue', item.clientId, item);

          // Log successful sync
          await supabase.from('sync_logs').insert({
            user_id: user.data.user.id,
            sync_type: 'upload',
            status: 'success',
            details: { operation: item.operationType, table: item.tableName }
          });

        } catch (error) {
          console.error('Sync error:', error);
          item.status = 'failed';
          item.attemptCount += 1;
          item.errorMessage = error.message;
          await indexedDB.update('syncQueue', item.clientId, item);

          // Log failed sync
          await supabase.from('sync_logs').insert({
            user_id: user.data.user.id,
            sync_type: 'upload',
            status: 'failed',
            details: { error: error.message, operation: item.operationType, table: item.tableName }
          });
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
        return await supabase.from(tableName as TableName).insert(data);

      case 'update':
        return await supabase.from(tableName as TableName).update(data).eq('id', recordId as string);

      case 'delete':
        return await supabase.from(tableName as TableName).delete().eq('id', recordId as string);

      default:
        throw new Error(`Unknown operation type: ${operationType}`);
    }
  }
}

export const syncService = new SyncService();
