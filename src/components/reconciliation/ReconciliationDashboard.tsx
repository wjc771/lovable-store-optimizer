
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Filter } from "lucide-react";
import { format } from "date-fns";
import { getReconciliationJobs } from "@/services/reconciliationService";
import { ReconciliationJob } from "@/types/reconciliation";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";

interface Props {
  storeId: string;
  onViewDetails: (jobId: string) => void;
}

export default function ReconciliationDashboard({ storeId, onViewDetails }: Props) {
  const [jobs, setJobs] = useState<ReconciliationJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    loadJobs();
  }, [storeId]);

  const loadJobs = async () => {
    try {
      const data = await getReconciliationJobs(storeId);
      setJobs(data);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('reconciliation.errors.loadFailed'),
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

  const filteredJobs = jobs.filter(job => 
    statusFilter === "all" ? true : job.status === statusFilter
  );

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{t('reconciliation.dashboard.title')}</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {t('reconciliation.dashboard.filter')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>{t('reconciliation.dashboard.filterByStatus')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
                <DropdownMenuRadioItem value="all">
                  {t('reconciliation.status.all')}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="pending">
                  {t('reconciliation.status.pending')}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="in_progress">
                  {t('reconciliation.status.inProgress')}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="completed">
                  {t('reconciliation.status.completed')}
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="failed">
                  {t('reconciliation.status.failed')}
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('reconciliation.fields.type')}</TableHead>
              <TableHead>{t('reconciliation.fields.createdAt')}</TableHead>
              <TableHead>{t('reconciliation.fields.status')}</TableHead>
              <TableHead>{t('reconciliation.fields.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium capitalize">{job.type}</TableCell>
                <TableCell>{format(new Date(job.created_at), 'PPp')}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getStatusColor(job.status)} text-white`}>
                    {t(`reconciliation.status.${job.status}`)}
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
            {filteredJobs.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  {t('reconciliation.dashboard.noJobs')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
