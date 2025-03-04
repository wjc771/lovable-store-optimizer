
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface Store {
  id: string;
  business_name: string;
  status: string;
  created_at: string;
  owner_id: string | null;
}

export const useStoreManagement = () => {
  const { toast } = useToast();
  const { user, isSuperAdmin } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: stores, isLoading, error: storesError, refetch } = useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      console.log("Fetching stores...");
      try {
        // Verify user authentication
        if (!user) {
          throw new Error("You must be logged in to view stores");
        }
        
        // Handling super admin differently to avoid RPC issues
        if (isSuperAdmin) {
          console.log("Super admin detected - fetching all stores");
          const { data, error } = await supabase
            .from('stores')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (error) {
            console.error("Error fetching stores for super admin:", error);
            throw new Error("Failed to fetch stores: " + error.message);
          }
          
          console.log(`Successfully fetched ${data?.length} stores for super admin`);
          return data as Store[];
        }
        
        // For regular users, use the RPC function
        console.log("Using get_user_accessible_stores RPC function for regular user");
        const { data, error } = await supabase.rpc('get_user_accessible_stores');
          
        if (error) {
          console.error("Error fetching stores via RPC:", error);
          throw new Error("Failed to fetch stores: " + error.message);
        }
        
        console.log(`Successfully fetched ${data?.length} stores for regular user`);
        return data as Store[];
      } catch (error) {
        console.error("Failed to fetch stores:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        
        toast({
          title: "Error loading stores",
          description: errorMessage,
          variant: "destructive",
        });
        
        throw error;
      }
    },
    retry: 1,
  });

  return {
    stores,
    isLoading,
    storesError,
    refetch,
    isDialogOpen,
    setIsDialogOpen
  };
};

export default useStoreManagement;
