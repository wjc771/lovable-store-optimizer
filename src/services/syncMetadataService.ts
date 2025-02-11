
import { supabase } from '@/integrations/supabase/client';
import { DeviceInfo, SyncPreferences } from '@/types/sync';
import { JsonValue, convertToJsonValue } from './types';

class SyncMetadataService {
  async getSyncMetadata() {
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
      return {
        ...data,
        device_info: data.device_info as DeviceInfo,
        sync_preferences: data.sync_preferences as SyncPreferences
      };
    }

    return null;
  }

  async updateSyncMetadata(metadata: Partial<Omit<SyncMetadata, 'id' | 'user_id' | 'created_at'>>) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('sync_metadata')
      .upsert({
        ...metadata,
        user_id: user.user.id,
        updated_at: new Date().toISOString(),
        device_info: metadata.device_info ? convertToJsonValue(metadata.device_info) : undefined,
        sync_preferences: metadata.sync_preferences ? convertToJsonValue(metadata.sync_preferences) : undefined
      });

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
  }) {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('sync_analytics')
      .insert({
        ...analytics,
        user_id: user.user.id,
        network_info: convertToJsonValue(analytics.network_info),
        error_details: convertToJsonValue(analytics.error_details)
      });

    if (error) throw error;
  }

  async getSyncPerformance(timeWindow: string = '24 hours') {
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
