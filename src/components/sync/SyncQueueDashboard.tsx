import React, { useState, useEffect } from 'react';
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
import ConflictResolutionDialog from './ConflictResolutionDialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { syncMetadataService } from '@/services/syncMetadataService';
import { SyncPerformance } from '@/types/sync';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';

const SyncQueueDashboard = () => {
  const { queueItems, syncStats, forceSyncNow, isSyncing, retryOperation } = useOffline();
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [performance, setPerformance] = useState<SyncPerformance | null>(null);
  const [timeWindow, setTimeWindow] = useState('24 hours');

  const { data: conflicts, refetch: refetchConflicts } = useQuery({
    queryKey: ['sync-conflicts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sync_conflicts')
        .select('*')
        .eq('resolution_status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const loadPerformance = async () => {
      try {
        const data = await syncMetadataService.getSyncPerformance(timeWindow);
        setPerformance(data);
      } catch (error) {
        console.error('Error loading sync performance:', error);
      }
    };

    loadPerformance();
    const interval = setInterval(loadPerformance, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, [timeWindow]);

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

  const handleConflictClick = (conflict: any) => {
    setSelectedConflict(conflict);
    setConflictDialogOpen(true);
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

      <div className="grid grid-cols-4 gap-4">
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
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Conflicts</div>
          <div className="text-2xl font-bold text-purple-500">{conflicts?.length || 0}</div>
        </Card>
      </div>

      {conflicts && conflicts.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <h3 className="text-purple-800 font-semibold mb-2">Data Conflicts Detected</h3>
          <p className="text-purple-600 text-sm mb-4">
            There are {conflicts.length} conflicts that need your attention. Please review and resolve them.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conflicts.map((conflict) => (
                <TableRow key={conflict.id}>
                  <TableCell className="capitalize">{conflict.table_name}</TableCell>
                  <TableCell>{format(new Date(conflict.created_at), 'PPp')}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-purple-500 border-purple-500">
                      Pending Resolution
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConflictClick(conflict)}
                    >
                      Resolve
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

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

      {performance && (
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Sync Performance</CardTitle>
            <CardDescription>Performance metrics for sync operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64">
              <BarChart
                width={600}
                height={200}
                data={[
                  {
                    name: 'Success Rate',
                    value: performance.successRate
                  },
                  {
                    name: 'Error Rate',
                    value: performance.errorRate
                  }
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">Average Sync Time</h4>
                <p>{performance.avgSyncTime.toFixed(2)}ms</p>
              </div>
              <div>
                <h4 className="font-semibold">Total Operations</h4>
                <p>{performance.totalOperations}</p>
              </div>
              {performance.mostCommonError && (
                <div className="col-span-2">
                  <h4 className="font-semibold">Most Common Error</h4>
                  <p className="text-destructive">{performance.mostCommonError}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <ConflictResolutionDialog
        open={conflictDialogOpen}
        onOpenChange={setConflictDialogOpen}
        conflict={selectedConflict}
        onResolved={refetchConflicts}
      />
    </Card>
  );
};

export default SyncQueueDashboard;
