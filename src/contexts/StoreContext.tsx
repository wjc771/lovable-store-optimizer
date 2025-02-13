
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

interface StoreSettings {
  general_preferences: {
    timezone: string;
  };
  business_preferences: {
    inventoryAlert: number;
    salesThreshold: number;
  };
  notification_preferences: {
    emailFrequency: 'instant' | 'daily' | 'weekly';
    pushNotifications: 'all' | 'important' | 'none';
  };
}

interface Store {
  id: string;
  businessName: string;
  settings: Json | null;
  storeSettings?: StoreSettings;
}

interface StoreContextType {
  store: Store | null;
  setStore: (store: Store | null) => void;
  updateStoreName: (name: string) => Promise<void>;
  updateStoreSettings: (settings: Partial<StoreSettings>) => Promise<void>;
  loading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadStore = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setLoading(false);
          return;
        }

        const { data: staffData } = await supabase
          .from('staff')
          .select('store_id')
          .eq('user_id', session.user.id)
          .single();

        if (staffData?.store_id) {
          const { data: storeData, error: storeError } = await supabase
            .from('stores')
            .select('*')
            .eq('id', staffData.store_id)
            .single();

          if (storeError) throw storeError;

          const { data: settingsData, error: settingsError } = await supabase
            .from('store_settings')
            .select('*')
            .eq('store_id', staffData.store_id)
            .maybeSingle();

          if (settingsError && settingsError.code !== 'PGRST116') throw settingsError;

          if (storeData) {
            const defaultSettings: StoreSettings = {
              general_preferences: { timezone: 'UTC' },
              business_preferences: { inventoryAlert: 10, salesThreshold: 1000 },
              notification_preferences: { emailFrequency: 'daily', pushNotifications: 'important' }
            };

            let parsedSettings: StoreSettings = defaultSettings;

            if (settingsData) {
              // Parse the JSON fields from the database
              parsedSettings = {
                general_preferences: typeof settingsData.general_preferences === 'object' ? 
                  settingsData.general_preferences as StoreSettings['general_preferences'] : 
                  defaultSettings.general_preferences,
                business_preferences: typeof settingsData.business_preferences === 'object' ? 
                  settingsData.business_preferences as StoreSettings['business_preferences'] : 
                  defaultSettings.business_preferences,
                notification_preferences: typeof settingsData.notification_preferences === 'object' ? 
                  settingsData.notification_preferences as StoreSettings['notification_preferences'] : 
                  defaultSettings.notification_preferences,
              };
            }

            setStore({
              id: storeData.id,
              businessName: storeData.business_name || 'My Store',
              settings: storeData.settings,
              storeSettings: parsedSettings
            });
          }
        }
      } catch (error) {
        console.error('Error loading store:', error);
        toast({
          title: "Error",
          description: "Failed to load store data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadStore();
  }, [toast]);

  const updateStoreName = async (name: string) => {
    if (!store) return;

    try {
      const { error } = await supabase
        .from('stores')
        .update({ business_name: name })
        .eq('id', store.id);

      if (error) throw error;

      setStore(prev => prev ? { ...prev, businessName: name } : null);
      
      toast({
        title: "Success",
        description: "Store name updated successfully",
      });
    } catch (error) {
      console.error('Error updating store name:', error);
      toast({
        title: "Error",
        description: "Failed to update store name",
        variant: "destructive",
      });
    }
  };

  const updateStoreSettings = async (settings: Partial<StoreSettings>) => {
    if (!store) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session found');

      const updateData = {
        store_id: store.id,
        user_id: session.user.id,
        ...(settings.general_preferences && { general_preferences: settings.general_preferences }),
        ...(settings.business_preferences && { business_preferences: settings.business_preferences }),
        ...(settings.notification_preferences && { notification_preferences: settings.notification_preferences })
      };

      const { error } = await supabase
        .from('store_settings')
        .upsert(updateData);

      if (error) throw error;

      setStore(prev => {
        if (!prev) return null;
        return {
          ...prev,
          storeSettings: {
            ...prev.storeSettings,
            ...settings
          } as StoreSettings
        };
      });

      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (error) {
      console.error('Error updating store settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  return (
    <StoreContext.Provider value={{ store, setStore, updateStoreName, updateStoreSettings, loading }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
