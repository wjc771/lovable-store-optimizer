
import { supabase } from '@/integrations/supabase/client';
import { DeviceInfo, SyncPreferences, SyncAnalytics } from '@/types/sync';

export interface SyncMetadata {
  id: string;
  lastSyncAt: Date | null;
  lastSuccessfulSyncAt: Date | null;
  syncFrequency: string | null;
  syncPreferences: SyncPreferences;
  deviceInfo: DeviceInfo;
}

class SyncMetadataService {
  async getSyncMetadata(): Promise<SyncMetadata | null> {
    const { data, error } = await supabase
      .from('sync_metadata')
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async updateSyncMetadata(metadata: Partial<SyncMetadata>): Promise<void> {
    const { error } = await supabase
      .from('sync_metadata')
      .upsert({
        ...metadata,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
  }

  async recordSyncAnalytics(analytics: Omit<SyncAnalytics, 'id' | 'created_at'>): Promise<void> {
    const { error } = await supabase
      .from('sync_analytics')
      .insert(analytics);

    if (error) throw error;
  }

  async getSyncPerformance(timeWindow: string = '24 hours'): Promise<any> {
    const { data, error } = await supabase
      .rpc('analyze_sync_performance', {
        p_time_window: timeWindow
      });

    if (error) throw error;
    return data;
  }
}

export const syncMetadataService = new SyncMetadataService();
