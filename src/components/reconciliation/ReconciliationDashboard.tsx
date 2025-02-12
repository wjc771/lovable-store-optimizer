
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ListCheck, Eye, FileText } from "lucide-react";
import { format } from "date-fns";
import { getReconciliationJobs } from "@/services/reconciliationService";
import { ReconciliationJob } from "@/types/reconciliation";
import { Badge } from "@/components/ui/badge";

interface Props {
  storeId: string;
  onViewDetails: (jobId: string) => void;
}

export default function ReconciliationDashboard({ storeId, onViewDetails }: Props) {
  const [jobs, setJobs] = useState<ReconciliationJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadJobs();
  }, [storeId]);

  const loadJobs = async () => {
    try {
      const data = await getReconciliationJobs(storeId);
      setJobs(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load reconciliation jobs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <ListCheck className="h-8 w-8 animate-pulse" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Reconciliation Jobs</h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium capitalize">{job.type}</TableCell>
                <TableCell>{format(new Date(job.created_at), 'PPp')}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getStatusColor(job.status)} text-white`}>
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewDetails(job.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {jobs.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No reconciliation jobs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
