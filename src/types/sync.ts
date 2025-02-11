
// PostgreSQL interval represented as string in ISO 8601 duration format
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

export interface SyncAnalytics {
  sync_type: string;
  operationCount: number;
  successCount: number;
  errorCount: number;
  totalTimeMs: number;
  avgOperationTimeMs: number;
  networkInfo: {
    type: string;
    downlink: number;
    rtt: number;
  };
  errorDetails: Record<string, any>;
}

export interface SyncPerformance {
  totalOperations: number;
  successRate: number;
  avgSyncTime: number;
  errorRate: number;
  mostCommonError: string;
}

// Base type for all database records that support versioning
export interface VersionedRecord {
  version?: number;
  updated_at?: string;
  created_at?: string;
}
