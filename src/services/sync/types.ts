
import { Database } from '@/integrations/supabase/types';
import { DeviceInfo, PostgresInterval, SyncPreferences } from '@/types/sync';

// Basic JSON type that matches Postgres jsonb
export type JsonPrimitive = string | number | boolean | null;
export type JsonArray = JsonValue[];
export type JsonObject = { [key: string]: JsonValue };
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

// Table types from database
export type TableNames = keyof Database['public']['Tables'];
export type ValidTableName = TableNames;

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
  sync_frequency: PostgresInterval | null;
  sync_preferences: SyncPreferences;
  device_info: DeviceInfo;
  created_at: string;
  updated_at: string;
}

export interface RecordData extends Record<string, JsonValue> {
  version?: number;
}

export interface SyncQueueItem {
  clientId: string;
  operationType: 'create' | 'update' | 'delete';
  tableName: ValidTableName;
  recordId?: string;
  data: RecordData;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  attemptCount: number;
  errorMessage?: string;
  errorType?: ErrorType;
  errorDetails?: JsonObject;
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
  return Array.isArray(value) && value.every(item => isJsonValue(item));
};

export const isJsonObject = (value: unknown): value is JsonObject => {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every(item => isJsonValue(item))
  );
};

export const isJsonValue = (value: unknown): value is JsonValue => {
  return (
    isJsonPrimitive(value) ||
    isJsonArray(value) ||
    isJsonObject(value)
  );
};

export const isRecordData = (value: unknown): value is RecordData => {
  if (!isJsonObject(value)) return false;
  if ('version' in value && typeof value.version !== 'undefined') {
    return typeof value.version === 'number';
  }
  return true;
};

export const convertToJsonValue = (value: unknown): JsonValue => {
  if (isJsonValue(value)) return value;
  return JSON.parse(JSON.stringify(value));
};
