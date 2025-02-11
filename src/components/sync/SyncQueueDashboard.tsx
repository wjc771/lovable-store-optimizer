
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
import { RefreshCw, AlertCircle, RotateCcw, Clock } from 'lucide-react';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SyncQueueDashboard = () => {
  const { queueItems, syncStats, forceSyncNow, isSyncing, retryOperation } = useOffline();

  const getErrorStatusColor = (errorType?: string) => {
    switch (errorType) {
      case 'network':
        return 'text-orange-500';
      case 'authorization':
        return 'text-red-500';
      case 'validation':
        return 'text-yellow-500';
      case 'conflict':
        return 'text-purple-500';
      default:
        return 'text-destructive';
    }
  };

  const getErrorDescription = (errorType?: string) => {
    switch (errorType) {
      case 'network':
        return 'Network connection issue - will retry automatically';
      case 'authorization':
        return 'Authentication error - please sign in again';
      case 'validation':
        return 'Invalid data - please check the data and try again';
      case 'conflict':
        return 'Data conflict detected - manual resolution needed';
      default:
        return 'Unknown error occurred';
    }
  };

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
            <TableHead>Actions</TableHead>
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
                {item.attemptCount > 0 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="outline" className="ml-2">
                          <Clock className="h-3 w-3 mr-1" />
                          {item.attemptCount}/3
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Retry attempts: {item.attemptCount}/3</p>
                        {item.lastRetryAt && (
                          <p>Last retry: {format(new Date(item.lastRetryAt), 'PPpp')}</p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </TableCell>
              <TableCell>{format(new Date(item.createdAt), 'PPpp')}</TableCell>
              <TableCell>
                {item.errorMessage && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className={`flex items-center gap-2 ${getErrorStatusColor(item.errorType)}`}>
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm truncate max-w-[200px]">
                            {item.errorMessage}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-semibold">{getErrorDescription(item.errorType)}</p>
                        <p className="text-sm">{item.errorMessage}</p>
                        {item.errorDetails && (
                          <pre className="text-xs mt-2 bg-secondary p-2 rounded">
                            {JSON.stringify(item.errorDetails, null, 2)}
                          </pre>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </TableCell>
              <TableCell>
                {item.status === 'failed' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => retryOperation(item.clientId)}
                    disabled={isSyncing || item.attemptCount >= 3}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Retry
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          {queueItems.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No sync operations in queue
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default SyncQueueDashboard;
