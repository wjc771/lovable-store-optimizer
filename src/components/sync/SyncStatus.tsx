
import React from 'react';
import { useOffline } from '@/contexts/OfflineContext';
import { Button } from '@/components/ui/button';
import { Cloud, CloudOff, Loader, AlertCircle } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";

export const SyncStatus = () => {
  const { isOnline, isSyncing, pendingChanges, syncStatus } = useOffline();

  const getStatusIcon = () => {
    if (!isOnline) return <CloudOff className="h-4 w-4 text-destructive" />;
    if (isSyncing) return <Loader className="h-4 w-4 animate-spin" />;
    if (syncStatus === 'error') return <AlertCircle className="h-4 w-4 text-destructive" />;
    return <Cloud className="h-4 w-4 text-primary" />;
  };

  const getStatusText = () => {
    if (!isOnline) return "Offline";
    if (isSyncing) return "Syncing...";
    if (syncStatus === 'error') return "Sync Error";
    if (pendingChanges > 0) return `${pendingChanges} pending`;
    return "Online";
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
        >
          <div className="relative">
            {getStatusIcon()}
            {pendingChanges > 0 && !isSyncing && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
              >
                {pendingChanges}
              </Badge>
            )}
          </div>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-64" align="end">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Sync Status</span>
            <Badge 
              variant={isOnline ? "default" : "destructive"}
              className="capitalize"
            >
              {getStatusText()}
            </Badge>
          </div>
          {pendingChanges > 0 && (
            <div className="text-sm text-muted-foreground">
              <span>{pendingChanges} changes pending synchronization</span>
            </div>
          )}
          {syncStatus === 'error' && (
            <div className="text-sm text-destructive">
              Some changes failed to sync. Please try again later.
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
