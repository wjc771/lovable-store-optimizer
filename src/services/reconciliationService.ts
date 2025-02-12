
import { supabase } from '@/integrations/supabase/client';
import { 
  ReconciliationJob, 
  ReconciliationType,
  ReconciliationItem,
  ResolutionType,
  ReconciliationStatus,
  ReconciliationItemStatus
} from '@/types/reconciliation';
import { Database } from '@/integrations/supabase/types';

type ReconciliationJobResponse = Database['public']['Tables']['reconciliation_jobs']['Row'];
type ReconciliationItemResponse = Database['public']['Tables']['reconciliation_items']['Row'];

export async function createReconciliationJob(
  type: ReconciliationType,
  fileUploadId: string,
  storeId: string,
  metadata: Record<string, any> = {}
): Promise<ReconciliationJob | null> {
  const { data: job, error } = await supabase
    .from('reconciliation_jobs')
    .insert({
      type,
      file_upload_id: fileUploadId,
      store_id: storeId,
      metadata,
      created_by: (await supabase.auth.getUser()).data.user?.id
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating reconciliation job:', error);
    return null;
  }

  return job ? mapReconciliationJob(job) : null;
}

export async function getReconciliationJobs(storeId: string): Promise<ReconciliationJob[]> {
  const { data: jobs, error } = await supabase
    .from('reconciliation_jobs')
    .select('*')
    .eq('store_id', storeId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reconciliation jobs:', error);
    return [];
  }

  return jobs?.map(mapReconciliationJob) || [];
}

export async function getReconciliationItems(jobId: string): Promise<ReconciliationItem[]> {
  const { data: items, error } = await supabase
    .from('reconciliation_items')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching reconciliation items:', error);
    return [];
  }

  return items?.map(mapReconciliationItem) || [];
}

export async function resolveReconciliationItem(
  itemId: string,
  resolution: ResolutionType,
  notes?: string
): Promise<boolean> {
  const { error } = await supabase
    .from('reconciliation_items')
    .update({
      status: 'resolved',
      resolution,
      resolved_at: new Date().toISOString(),
      resolved_by: (await supabase.auth.getUser()).data.user?.id,
      notes
    })
    .eq('id', itemId);

  if (error) {
    console.error('Error resolving reconciliation item:', error);
    return false;
  }

  return true;
}

export async function processReconciliationFile(fileId: string): Promise<void> {
  const { data: result, error } = await supabase.functions.invoke('process-reconciliation', {
    body: { fileId }
  });

  if (error) {
    console.error('Error processing reconciliation file:', error);
    throw error;
  }

  return result;
}

// Helper functions to map database types to our interfaces
function mapReconciliationJob(job: ReconciliationJobResponse): ReconciliationJob {
  return {
    id: job.id,
    type: job.type as ReconciliationType,
    status: job.status as ReconciliationStatus,
    file_upload_id: job.file_upload_id || '',
    created_at: job.created_at,
    completed_at: job.completed_at || undefined,
    created_by: job.created_by || '',
    store_id: job.store_id || '',
    metadata: job.metadata as Record<string, any>,
    version: job.version || 1
  };
}

function mapReconciliationItem(item: ReconciliationItemResponse): ReconciliationItem {
  return {
    id: item.id,
    job_id: item.job_id,
    table_name: item.table_name,
    record_id: item.record_id || undefined,
    system_value: item.system_value as Record<string, any>,
    uploaded_value: item.uploaded_value as Record<string, any>,
    status: item.status as ReconciliationItemStatus,
    resolution: item.resolution as ResolutionType | undefined,
    resolved_at: item.resolved_at || undefined,
    resolved_by: item.resolved_by || undefined,
    notes: item.notes || undefined,
    version: item.version || 1
  };
}
