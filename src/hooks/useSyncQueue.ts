
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { indexedDB } from '@/services/indexedDB';
import { SyncQueueItem } from '@/services/syncService';

export const useSyncQueue = () => {
  const [queueItems, setQueueItems] = useState<SyncQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQueueItems = async () => {
      try {
        const items = await indexedDB.getAll<SyncQueueItem>('syncQueue');
        setQueueItems(items);
      } catch (err) {
        console.error('Error loading queue items:', err);
        setError('Failed to load sync queue');
      } finally {
        setIsLoading(false);
      }
    };

    loadQueueItems();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('sync-queue-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sync_queue'
        },
        async (payload) => {
          // Refresh local queue items when remote changes occur
          const items = await indexedDB.getAll<SyncQueueItem>('syncQueue');
          setQueueItems(items);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getPendingCount = () => {
    return queueItems.filter(item => item.status === 'pending').length;
  };

  const getFailedCount = () => {
    return queueItems.filter(item => item.status === 'failed').length;
  };

  const getProcessingCount = () => {
    return queueItems.filter(item => item.status === 'processing').length;
  };

  return {
    queueItems,
    isLoading,
    error,
    stats: {
      pending: getPendingCount(),
      failed: getFailedCount(),
      processing: getProcessingCount(),
    }
  };
};
