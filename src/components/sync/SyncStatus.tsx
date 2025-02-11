
import React from 'react';
import { useOffline } from '@/contexts/OfflineContext';
import { Button } from '@/components/ui/button';
import { Cloud, CloudOff, Loader, AlertCircle, RefreshCw } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export const SyncStatus = () => {
  const { 
    isOnline, 
    isSyncing, 
    syncStatus, 
    syncStats, 
    queueItems,
    forceSyncNow 
  } = useOffline();

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
    if (syncStats.pending > 0) return `${syncStats.pending} pending`;
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
            {syncStats.pending > 0 && !isSyncing && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
              >
                {syncStats.pending}
              </Badge>
            )}
          </div>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Sync Status</span>
            <Badge 
              variant={isOnline ? "default" : "destructive"}
              className="capitalize"
            >
              {getStatusText()}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <div className="font-semibold">{syncStats.pending}</div>
              <div className="text-muted-foreground">Pending</div>
            </div>
            <div>
              <div className="font-semibold">{syncStats.processing}</div>
              <div className="text-muted-foreground">Processing</div>
            </div>
            <div>
              <div className="font-semibold text-destructive">{syncStats.failed}</div>
              <div className="text-muted-foreground">Failed</div>
            </div>
          </div>

          {queueItems.length > 0 && (
            <ScrollArea className="h-[100px]">
              <div className="space-y-2">
                {queueItems.map((item) => (
                  <div
                    key={item.clientId}
                    className="text-sm flex items-center justify-between"
                  >
                    <span className="truncate flex-1">
                      {item.operationType} {item.tableName}
                    </span>
                    <Badge 
                      variant={
                        item.status === 'failed' 
                          ? "destructive" 
                          : item.status === 'processing' 
                            ? "secondary"
                            : "default"
                      }
                    >
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {isOnline && (syncStats.pending > 0 || syncStatus === 'error') && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={forceSyncNow}
              disabled={isSyncing}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Now
            </Button>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
