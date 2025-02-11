
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

type SyncTable = 'sales' | 'customers' | 'orders' | 'tasks' | 'products';

interface ConflictData {
  id: string;
  table_name: SyncTable;
  client_data: any;
  server_data: any;
  created_at: string;
  resolution_status: string;
  record_id: string;
}

interface ConflictResolutionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conflict: ConflictData | null;
  onResolved: () => void;
}

const ConflictResolutionDialog = ({
  open,
  onOpenChange,
  conflict,
  onResolved
}: ConflictResolutionDialogProps) => {
  const { toast } = useToast();

  if (!conflict) return null;

  const handleResolveConflict = async (useClientData: boolean) => {
    try {
      const { error } = await supabase
        .from('sync_conflicts')
        .update({
          resolution_status: 'resolved',
          resolved_at: new Date().toISOString(),
          resolution_notes: `Conflict resolved using ${useClientData ? 'client' : 'server'} data`
        })
        .eq('id', conflict.id);

      if (error) throw error;

      // Update the original record with the chosen data
      const dataToUse = useClientData ? conflict.client_data : conflict.server_data;
      const { error: updateError } = await supabase
        .from(conflict.table_name)
        .update(dataToUse)
        .eq('id', conflict.record_id);

      if (updateError) throw updateError;

      toast({
        title: "Conflict resolved",
        description: "The data has been successfully updated",
      });

      onResolved();
      onOpenChange(false);
    } catch (error) {
      console.error('Error resolving conflict:', error);
      toast({
        title: "Error",
        description: "Failed to resolve the conflict. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatData = (data: any) => {
    return Object.entries(data).map(([key, value]) => (
      <div key={key} className="py-1">
        <span className="font-semibold">{key}: </span>
        <span className="font-mono">
          {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
        </span>
      </div>
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Resolve Data Conflict</DialogTitle>
          <DialogDescription>
            A conflict was detected in {conflict.table_name} at{' '}
            {format(new Date(conflict.created_at), 'PPpp')}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Local Changes</CardTitle>
              <CardDescription>Data from your device</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {formatData(conflict.client_data)}
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleResolveConflict(true)}
                className="w-full"
              >
                Use Local Version
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Server Version</CardTitle>
              <CardDescription>Data from the server</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                {formatData(conflict.server_data)}
              </ScrollArea>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleResolveConflict(false)}
                className="w-full"
              >
                Use Server Version
              </Button>
            </CardFooter>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConflictResolutionDialog;
