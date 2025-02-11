
import React from 'react';
import { useOffline } from '@/contexts/OfflineContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export const SyncQueueDashboard = () => {
  const { queueItems, syncStats, forceSyncNow, isSyncing } = useOffline();

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Sync Queue</h2>
        <Button
          onClick={forceSyncNow}
          disabled={isSyncing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Pending</div>
          <div className="text-2xl font-bold">{syncStats.pending}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Processing</div>
          <div className="text-2xl font-bold">{syncStats.processing}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Failed</div>
          <div className="text-2xl font-bold text-destructive">{syncStats.failed}</div>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Operation</TableHead>
            <TableHead>Table</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Error</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queueItems.map((item) => (
            <TableRow key={item.clientId}>
              <TableCell className="capitalize">{item.operationType}</TableCell>
              <TableCell className="capitalize">{item.tableName}</TableCell>
              <TableCell>
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
              </TableCell>
              <TableCell>{format(new Date(item.createdAt), 'PPpp')}</TableCell>
              <TableCell>
                {item.errorMessage && (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm truncate max-w-[200px]">
                      {item.errorMessage}
                    </span>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
          {queueItems.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No sync operations in queue
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
