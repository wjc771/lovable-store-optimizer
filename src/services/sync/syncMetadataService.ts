
import { supabase } from '@/integrations/supabase/client';
import { DeviceInfo, SyncPreferences } from '@/types/sync';
import { JsonValue, SyncMetadata, isJsonValue } from './types';

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
    return data;
  }

  async updateSyncMetadata(metadata: Partial<Omit<SyncMetadata, 'id' | 'user_id' | 'created_at'>>): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('sync_metadata')
      .upsert({
        ...metadata,
        user_id: user.user.id,
        updated_at: new Date().toISOString(),
        device_info: metadata.device_info && JSON.stringify(metadata.device_info),
        sync_preferences: metadata.sync_preferences && JSON.stringify(metadata.sync_preferences)
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
  }): Promise<void> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('sync_analytics')
      .insert({
        ...analytics,
        user_id: user.user.id,
        network_info: JSON.stringify(analytics.network_info),
        error_details: JSON.stringify(analytics.error_details)
      });

    if (error) throw error;
  }

  async getSyncPerformance(timeWindow: string = '24 hours'): Promise<any> {
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
