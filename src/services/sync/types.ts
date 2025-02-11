
import { Database } from '@/integrations/supabase/types';

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type TableNames = keyof Database['public']['Tables'];
export type ValidTableName = TableNames;

export interface NetworkInfo {
  type: string;
  downlink: number;
  rtt: number;
}

export interface SyncMetadata {
  id: string;
  user_id: string;
  last_sync_at: string | null;
  last_successful_sync_at: string | null;
  sync_frequency: string | null;
  sync_preferences: Json;
  device_info: Json;
  created_at: string;
  updated_at: string;
}

export interface SyncQueueItem {
  clientId: string;
  operationType: 'create' | 'update' | 'delete';
  tableName: ValidTableName;
  recordId?: string;
  data: Json;
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
