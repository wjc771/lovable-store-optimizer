
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Store, AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Store {
  id: string;
  business_name: string;
  status: string;
  created_at: string;
  owner_id: string | null;
}

const StoreManagement = () => {
  const [newStoreName, setNewStoreName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, isSuperAdmin } = useAuth(); // Usar AuthContext para obter status de superadmin

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

  const createStore = useMutation({
    mutationFn: async ({ storeName, email }: { storeName: string; email: string }) => {
      console.log("Creating store with name:", storeName, "for owner:", email);
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error("Error getting user session:", sessionError);
          throw new Error("Failed to get user session: " + sessionError.message);
        }
        
        console.log("Current user session:", session?.user.email);
        
        if (!session) {
          throw new Error("You must be logged in to create a store");
        }
        
        const { data: store, error: storeError } = await supabase
          .from("stores")
          .insert([
            {
              business_name: storeName,
              name: storeName,
              created_by: session?.user.id
            },
          ])
          .select()
          .single();

        if (storeError) {
          console.error("Error creating store:", storeError);
          throw new Error("Failed to create store: " + storeError.message);
        }
        console.log("Store created successfully:", store);

        const token = crypto.randomUUID();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const { error: inviteError } = await supabase
          .from("store_invites")
          .insert([
            {
              store_id: store.id,
              email,
              role: "admin",
              token,
              expires_at: expiresAt.toISOString(),
              created_by: session?.user.id
            },
          ]);

        if (inviteError) {
          console.error("Error creating store invite:", inviteError);
          toast({
            title: "Store created but invite failed",
            description: "The store was created but the invite couldn't be sent. You can try resending the invite later.",
            variant: "destructive",
          });
        } else {
          console.log("Store invite created successfully with token:", token);
        }

        return { store, token };
      } catch (error) {
        console.error("Failed to create store:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Store creation mutation completed successfully");
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      setIsDialogOpen(false);
      setNewStoreName("");
      setOwnerEmail("");
      
      toast({
        title: "Store created successfully",
        description: `Invite link: ${window.location.origin}/auth?token=${data.token}`,
      });
    },
    onError: (error) => {
      console.error("Store creation failed:", error);
      toast({
        title: "Error creating store",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating store...");
    if (!newStoreName || !ownerEmail) {
      toast({
        title: "Missing information",
        description: "Please provide both store name and owner email",
        variant: "destructive",
      });
      return;
    }

    createStore.mutate({ storeName: newStoreName, email: ownerEmail });
  };

  if (storesError) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
            <h3 className="text-lg font-semibold">Error loading stores</h3>
          </div>
          <p className="mt-2">There was a problem loading the store list. Please try refreshing the page.</p>
          <p className="text-sm mt-1 text-red-600">
            {storesError instanceof Error ? storesError.message : "Unknown error"}
          </p>
        </div>
        <Button 
          onClick={() => refetch()} 
          className="flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Store Management</h1>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Store Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New Store
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Store</DialogTitle>
              <DialogDescription>
                Create a new store and send an invitation to the owner.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateStore} className="space-y-4 pt-4">
              <div>
                <label
                  htmlFor="store-name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Store Name
                </label>
                <Input
                  id="store-name"
                  value={newStoreName}
                  onChange={(e) => setNewStoreName(e.target.value)}
                  placeholder="Enter store name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="owner-email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Owner Email
                </label>
                <Input
                  id="owner-email"
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="Enter owner email"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createStore.isPending}>
                  {createStore.isPending ? "Creating..." : "Create Store"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {stores && stores.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell className="font-medium">{store.business_name}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        store.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {store.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(store.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/stores/${store.id}`)}
                    >
                      <Store className="mr-2 h-4 w-4" />
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No stores found</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Create your first store to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreManagement;
