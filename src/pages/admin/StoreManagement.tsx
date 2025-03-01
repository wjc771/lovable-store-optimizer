
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
import { Plus, Store } from "lucide-react";

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

  // Fetch stores with better error handling
  const { data: stores, isLoading, error: storesError } = useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      console.log("Fetching stores...");
      try {
        const { data, error } = await supabase
          .from("stores")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching stores:", error);
          toast({
            title: "Error loading stores",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }
        console.log("Stores fetched successfully:", data);
        return data as Store[];
      } catch (error) {
        console.error("Failed to fetch stores:", error);
        throw error;
      }
    },
    onError: (error) => {
      console.error("Query error fetching stores:", error);
      toast({
        title: "Error loading stores",
        description: "There was an error loading the stores. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Create new store mutation with improved error reporting
  const createStore = useMutation({
    mutationFn: async ({ storeName, email }: { storeName: string; email: string }) => {
      console.log("Creating store with name:", storeName, "for owner:", email);
      try {
        // Get current user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error("Error getting user session:", sessionError);
          throw new Error("Failed to get user session: " + sessionError.message);
        }
        
        console.log("Current user session:", session?.user.email);
        
        if (!session) {
          throw new Error("You must be logged in to create a store");
        }
        
        // First create the store
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

        // Generate a unique invite token
        const token = crypto.randomUUID();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // Token expires in 7 days

        // Create store invite
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
          // We don't want to throw here as the store was already created
          // Instead, we'll show a toast warning that the invite failed
          toast({
            title: "Store created but invite failed",
            description: "The store was created but the invite couldn't be sent. You can try resending the invite later.",
            variant: "warning",
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
      
      // Here you would typically send an email to the store owner with the invite link
      // For now, we'll show it in a toast
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

  // If there was an error fetching stores, display it
  if (storesError) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold">Error loading stores</h3>
          <p>There was a problem loading the store list. Please try refreshing the page.</p>
        </div>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["stores"] })}>
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
