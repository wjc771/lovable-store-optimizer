
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';

interface Store {
  id: string;
  businessName: string;
  settings: Json | null; // Changed from Record<string, any> to Json | null to match Supabase types
}

interface StoreContextType {
  store: Store | null;
  setStore: (store: Store | null) => void;
  updateStoreName: (name: string) => Promise<void>;
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
          const { data: storeData, error } = await supabase
            .from('stores')
            .select('*')
            .eq('id', staffData.store_id)
            .single();

          if (error) throw error;

          if (storeData) {
            setStore({
              id: storeData.id,
              businessName: storeData.business_name || 'My Store',
              settings: storeData.settings
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

  return (
    <StoreContext.Provider value={{ store, setStore, updateStoreName, loading }}>
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
