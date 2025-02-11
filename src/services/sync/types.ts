
import { Database } from '@/integrations/supabase/types';

// Basic JSON type that matches Postgres jsonb
export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = Json[];
export type JsonObject = { [key: string]: Json };
export type Json = JsonPrimitive | JsonObject | JsonArray;

// Table types from database
export type TableNames = keyof Database['public']['Tables'];
export type ValidTableName = TableNames;

// Utility type for safer JSON handling
export type SafeJson<T> = T extends JsonPrimitive ? T :
  T extends Array<infer U> ? SafeJson<U>[] :
  T extends object ? { [K in keyof T]: SafeJson<T[K]> } :
  never;

// Network info type
export interface NetworkInfo {
  type: string;
  downlink: number;
  rtt: number;
}

// Base interfaces matching database schema
export interface SyncMetadata {
  id: string;
  user_id: string;
  last_sync_at: string | null;
  last_successful_sync_at: string | null;
  sync_frequency: unknown; // PostgreSQL interval type
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
  errorDetails?: Json;
  createdAt: Date;
  updatedAt: Date;
  lastRetryAt?: Date;
  compressedData?: Uint8Array;
  compressionAlgorithm?: string;
}

export type ErrorType = 'network' | 'validation' | 'authorization' | 'conflict' | 'unknown';

// Type guards for runtime checks
export const isJsonPrimitive = (value: unknown): value is JsonPrimitive => {
  return (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
};

export const isJsonArray = (value: unknown): value is JsonArray => {
  return Array.isArray(value) && value.every(item => isJson(item));
};

export const isJsonObject = (value: unknown): value is JsonObject => {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every(item => isJson(item))
  );
};

export const isJson = (value: unknown): value is Json => {
  return (
    isJsonPrimitive(value) ||
    isJsonArray(value) ||
    isJsonObject(value)
  );
};
