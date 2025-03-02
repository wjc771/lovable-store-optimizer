
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
        // Verificamos primeiro se o usuário está autenticado
        if (!user) {
          throw new Error("You must be logged in to view stores");
        }
        
        // Se usuário for superadmin via AuthContext, não precisamos verificar novamente
        if (isSuperAdmin) {
          console.log("User is super admin via AuthContext, fetching all stores");
          const { data, error } = await supabase
            .from("stores")
            .select("*")
            .order("created_at", { ascending: false });
            
          if (error) {
            console.error("Error fetching stores:", error);
            throw new Error(error.message);
          }
          
          console.log("Admin - fetched all stores:", data?.length);
          return data as Store[];
        } 
        
        // Caso contrário, tente usar o RPC alternativo
        console.log("Fetching user's accessible stores via RPC");
        const { data, error } = await supabase.rpc('get_user_accessible_stores');
          
        if (error) {
          console.error("Error fetching user's stores via RPC:", error);
          
          // Fallback para busca direta caso o RPC falhe
          console.log("Trying alternative approach: direct query with joins");
          
          // Obter as lojas onde o usuário é proprietário
          const { data: ownedStores, error: ownedError } = await supabase
            .from("stores")
            .select("*")
            .eq("owner_id", user.id)
            .order("created_at", { ascending: false });
            
          if (ownedError) {
            console.error("Error fetching owned stores:", ownedError);
            throw new Error("Failed to fetch stores: " + ownedError.message);
          }
          
          // Obter lojas onde o usuário é funcionário
          const { data: staffData, error: staffError } = await supabase
            .from("staff")
            .select("store_id")
            .eq("user_id", user.id)
            .eq("status", "active");
            
          if (staffError) {
            console.error("Error fetching staff stores:", staffError);
            // Retornar só as lojas como proprietário se a busca de staff falhar
            console.log("Returning only owned stores:", ownedStores?.length);
            return ownedStores as Store[];
          }
          
          if (staffData.length > 0) {
            const storeIds = staffData.map(s => s.store_id);
            const { data: staffStores, error: storesError } = await supabase
              .from("stores")
              .select("*")
              .in("id", storeIds)
              .order("created_at", { ascending: false });
              
            if (storesError) {
              console.error("Error fetching staff stores details:", storesError);
              // Retornar só as lojas como proprietário se a busca de detalhes do staff falhar
              return ownedStores as Store[];
            }
            
            // Combinar as lojas como proprietário e como funcionário
            const allStores = [...(ownedStores || []), ...(staffStores || [])];
            // Remover duplicatas
            const uniqueStores = allStores.filter((store, index, self) =>
              index === self.findIndex((s) => s.id === store.id)
            );
            
            console.log("Returning combined stores:", uniqueStores.length);
            return uniqueStores as Store[];
          } else {
            // Não há lojas como funcionário, retornar apenas as lojas como proprietário
            return ownedStores as Store[];
          }
        }
        
        console.log("RPC approach successful - fetched stores:", data?.length);
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
