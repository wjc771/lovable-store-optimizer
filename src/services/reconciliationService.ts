
import { supabase } from '@/integrations/supabase/client';
import { 
  ReconciliationJob, 
  ReconciliationType,
  ReconciliationItem,
  ResolutionType
} from '@/types/reconciliation';

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

  return job;
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

  return jobs;
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

  return items;
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
