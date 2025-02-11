
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
