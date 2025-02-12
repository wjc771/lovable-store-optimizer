
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, X } from "lucide-react";
import { getReconciliationItems, resolveReconciliationItem } from "@/services/reconciliationService";
import { ReconciliationItem, ResolutionType } from "@/types/reconciliation";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Props {
  jobId: string;
  onBack: () => void;
}

export default function ReconciliationDetails({ jobId, onBack }: Props) {
  const [items, setItems] = useState<ReconciliationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadItems();
  }, [jobId]);

  const loadItems = async () => {
    try {
      const data = await getReconciliationItems(jobId);
      setItems(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reconciliation items",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async (itemId: string, resolution: ResolutionType) => {
    try {
      await resolveReconciliationItem(itemId, resolution);
      await loadItems();
      toast({
        title: "Success",
        description: "Item resolved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve item",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-pulse" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-semibold">Reconciliation Details</h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Table</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>System Value</TableHead>
              <TableHead>Uploaded Value</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.table_name}</TableCell>
                <TableCell>
                  <Badge variant={item.status === 'resolved' ? 'default' : 'secondary'}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">View</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>System Value</DialogTitle>
                      </DialogHeader>
                      <pre className="mt-4 bg-muted p-4 rounded-lg overflow-auto">
                        {JSON.stringify(item.system_value, null, 2)}
                      </pre>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">View</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Uploaded Value</DialogTitle>
                      </DialogHeader>
                      <pre className="mt-4 bg-muted p-4 rounded-lg overflow-auto">
                        {JSON.stringify(item.uploaded_value, null, 2)}
                      </pre>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  {item.status !== 'resolved' && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleResolve(item.id, 'system')}
                        title="Use System Value"
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleResolve(item.id, 'uploaded')}
                        title="Use Uploaded Value"
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No reconciliation items found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
