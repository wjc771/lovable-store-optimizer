
import React, { createContext, useContext, useEffect, useState } from 'react';
import { indexedDB } from '@/services/indexedDB';
import { syncService, SyncQueueItem } from '@/services/syncService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSyncQueue } from '@/hooks/useSyncQueue';

interface OfflineContextType {
  isOnline: boolean;
  isSyncing: boolean;
  pendingChanges: number;
  syncStatus: 'idle' | 'syncing' | 'error';
  syncStats: {
    pending: number;
    failed: number;
    processing: number;
  };
  queueItems: SyncQueueItem[];
  forceSyncNow: () => Promise<void>;
  retryOperation: (clientId: string) => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType>({
  isOnline: true,
  isSyncing: false,
  pendingChanges: 0,
  syncStatus: 'idle',
  syncStats: {
    pending: 0,
    failed: 0,
    processing: 0,
  },
  queueItems: [],
  forceSyncNow: async () => {},
  retryOperation: async () => {}
});

export const useOffline = () => useContext(OfflineContext);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  const { toast } = useToast();
  const { queueItems, stats } = useSyncQueue();

  const retryOperation = async (clientId: string) => {
    try {
      await syncService.retryFailedOperation(clientId);
      toast({
        title: "Retry initiated",
        description: "The operation will be retried shortly.",
      });
    } catch (error) {
      console.error('Retry error:', error);
      toast({
        title: "Retry failed",
        description: "Failed to initiate retry. Please try again.",
        variant: "destructive"
      });
    }
  };

  const forceSyncNow = async () => {
    if (!isOnline) {
      toast({
        title: "Cannot sync while offline",
        description: "Please check your internet connection and try again.",
        variant: "destructive"
      });
      return;
    }

    if (isSyncing) {
      toast({
        title: "Sync in progress",
        description: "Please wait for the current sync to complete.",
      });
      return;
    }

    try {
      setIsSyncing(true);
      setSyncStatus('syncing');
      await syncService.syncPendingItems();
      setSyncStatus('idle');
      toast({
        title: "Sync completed",
        description: "All changes have been synchronized successfully.",
      });
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
      toast({
        title: "Sync failed",
        description: "Some changes failed to sync. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back Online",
        description: "Your connection has been restored. Syncing changes...",
      });
      forceSyncNow();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're Offline",
        description: "Changes will be saved locally and synced when you're back online.",
        variant: "destructive"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const value = {
    isOnline,
    isSyncing,
    pendingChanges: stats.pending,
    syncStatus,
    syncStats: stats,
    queueItems,
    forceSyncNow,
    retryOperation
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};
