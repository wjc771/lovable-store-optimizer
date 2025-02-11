
import { Database } from '@/integrations/supabase/types';

export type TableNames = keyof Database['public']['Tables'];
export type ValidTableName = TableNames;

export interface NetworkInfo {
  type: string;
  downlink: number;
  rtt: number;
}

export interface SyncQueueItem {
  clientId: string;
  operationType: 'create' | 'update' | 'delete';
  tableName: ValidTableName;
  recordId?: string;
  data: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attemptCount: number;
  errorMessage?: string;
  errorType?: ErrorType;
  errorDetails?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  lastRetryAt?: Date;
  compressedData?: Uint8Array;
  compressionAlgorithm?: string;
}

export type ErrorType = 'network' | 'validation' | 'authorization' | 'conflict' | 'unknown';

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];
