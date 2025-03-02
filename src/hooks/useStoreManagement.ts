
import { useState, useEffect } from "react";
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
  const { user } = useAuth();
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
        
        // Use the get_user_accessible_stores RPC function for any user
        console.log("Using get_user_accessible_stores RPC function");
        const { data: storesData, error: storesError } = await supabase
          .rpc("get_user_accessible_stores");

        if (storesError) throw storesError;
        
        console.log(`Successfully fetched ${storesData?.length} stores`);
        return storesData as Store[];
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
