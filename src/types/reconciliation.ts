
export type ReconciliationType = 'inventory' | 'sales' | 'customers' | 'orders' | 'financial';
export type ReconciliationStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
export type ReconciliationItemStatus = 'pending' | 'resolved' | 'ignored';
export type ResolutionType = 'system' | 'uploaded' | 'manual';

export interface ReconciliationJob {
  id: string;
  type: ReconciliationType;
  status: ReconciliationStatus;
  file_upload_id: string;
  created_at: string;
  completed_at?: string;
  created_by: string;
  store_id: string;
  metadata: Record<string, any>;
  version: number;
}

export interface ReconciliationItem {
  id: string;
  job_id: string;
  table_name: string;
  record_id?: string;
  system_value: Record<string, any>;
  uploaded_value: Record<string, any>;
  status: ReconciliationItemStatus;
  resolution?: ResolutionType;
  resolved_at?: string;
  resolved_by?: string;
  notes?: string;
  version: number;
}

export interface ReconciliationHistory {
  id: string;
  item_id: string;
  action: string;
  previous_value?: Record<string, any>;
  new_value?: Record<string, any>;
  performed_at: string;
  performed_by: string;
  store_id: string;
  version: number;
}
