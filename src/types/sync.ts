
// This file can be deleted if no other parts of the application need these types
export type PostgresInterval = string;

export interface DeviceInfo {
  deviceId: string;
  platform: string;
  browser: string;
  lastActive: string;
}

export interface SyncPreferences {
  autoSync: boolean;
  syncOnMeteredConnection: boolean;
  maxRetries: number;
}

// Base type for all database records that support versioning
export interface VersionedRecord {
  version?: number;
  updated_at?: string;
  created_at?: string;
}
