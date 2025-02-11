
import { supabase } from '@/integrations/supabase/client';
import { DeviceInfo, PostgresInterval, SyncPreferences } from '@/types/sync';
import { JsonValue, SyncMetadata } from '@/services/sync/types';

class SyncMetadataService {
  async getSyncMetadata(): Promise<SyncMetadata | null> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return null;

    const { data, error } = await supabase
      .from('sync_metadata')
      .select('*')
      .eq('user_id', user.user.id)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      // Convert stored JSON back to proper types
      const deviceInfo = data.device_info as unknown as DeviceInfo;
      const syncPreferences = data.sync_preferences as unknown as SyncPreferences;
      
      return {
        ...data,
        device_info: deviceInfo,
        sync_preferences: syncPreferences,
        sync_frequency: data.sync_frequency as PostgresInterval
      };
    }

    return null;
  }

  async updateSyncMetadata(metadata: Partial<Omit<SyncMetadata, 'id' | 'user_id' | 'created_at'>>): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const dataToUpdate = {
      ...metadata,
      user_id: user.user.id,
      updated_at: new Date().toISOString()
    };

    if (metadata.device_info) {
      dataToUpdate.device_info = metadata.device_info;
    }

    if (metadata.sync_preferences) {
      dataToUpdate.sync_preferences = metadata.sync_preferences;
    }

    const { error } = await supabase
      .from('sync_metadata')
      .upsert(dataToUpdate);

    if (error) throw error;
  }

  async recordSyncAnalytics(analytics: {
    sync_type: string;
    operation_count: number;
    success_count: number;
    error_count: number;
    total_time_ms: number;
    avg_operation_time_ms: number;
    network_info: Record<string, any>;
    error_details: Record<string, any>;
  }): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('sync_analytics')
      .insert({
        ...analytics,
        user_id: user.user.id,
        network_info: analytics.network_info,
        error_details: analytics.error_details
      });

    if (error) throw error;
  }

  async getSyncPerformance(timeWindow: string = '24 hours'): Promise<{
    total_operations: number;
    success_rate: number;
    avg_sync_time: number;
    error_rate: number;
    most_common_error: string;
  }> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .rpc('analyze_sync_performance', {
        p_user_id: user.user.id,
        p_time_window: timeWindow
      });

    if (error) throw error;
    return data;
  }
}

export const syncMetadataService = new SyncMetadataService();
