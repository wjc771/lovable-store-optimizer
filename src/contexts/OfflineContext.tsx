
import React, { createContext, useContext, useEffect, useState } from 'react';
import { indexedDB } from '@/services/indexedDB';
import { syncService, SyncQueueItem } from '@/services/syncService';
import { useToast } from '@/hooks/use-toast';

interface OfflineContextType {
  isOnline: boolean;
  isSyncing: boolean;
  pendingChanges: number;
  syncStatus: 'idle' | 'syncing' | 'error';
}

const OfflineContext = createContext<OfflineContextType>({
  isOnline: true,
  isSyncing: false,
  pendingChanges: 0,
  syncStatus: 'idle'
});

export const useOffline = () => useContext(OfflineContext);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(0);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back Online",
        description: "Your connection has been restored. Syncing changes...",
      });
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

    // Initialize IndexedDB
    indexedDB.initDB().catch(error => {
      console.error('Failed to initialize IndexedDB:', error);
      toast({
        title: "Error",
        description: "Failed to initialize offline storage",
        variant: "destructive"
      });
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const checkPendingChanges = async () => {
      try {
        const queue = await indexedDB.getAll<SyncQueueItem>('syncQueue');
        const pending = queue.filter(item => item.status === 'pending').length;
        setPendingChanges(pending);
      } catch (error) {
        console.error('Error checking pending changes:', error);
      }
    };

    const interval = setInterval(checkPendingChanges, 5000);
    checkPendingChanges();

    return () => clearInterval(interval);
  }, []);

  const value = {
    isOnline,
    isSyncing,
    pendingChanges,
    syncStatus
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};
