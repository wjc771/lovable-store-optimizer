
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

interface CreateStoreDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateStoreDialog = ({ isOpen, onOpenChange }: CreateStoreDialogProps) => {
  const [newStoreName, setNewStoreName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isSuperAdmin } = useAuth();

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
        
        // Criar a loja
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

        // Se não for superadmin ou o email for diferente do usuário atual, criar convite
        if (!isSuperAdmin || email !== session.user.email) {
          // Criar o convite em uma transação separada
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
            return { store, token };
          }
        }

        return { store };
      } catch (error) {
        console.error("Failed to create store:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Store creation mutation completed successfully");
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      onOpenChange(false);
      setNewStoreName("");
      setOwnerEmail("");
      
      toast({
        title: "Store created successfully",
        description: data.token 
          ? `Invite link: ${window.location.origin}/auth?token=${data.token}`
          : "Store has been created successfully",
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
    
    if (!newStoreName) {
      toast({
        title: "Missing information",
        description: "Please provide a store name",
        variant: "destructive",
      });
      return;
    }
    
    // Se for superadmin, usar o email do próprio usuário se não for fornecido
    if (isSuperAdmin && !ownerEmail) {
      createStore.mutate({ 
        storeName: newStoreName, 
        email: user?.email || "" 
      });
      return;
    }

    if (!ownerEmail) {
      toast({
        title: "Missing information",
        description: "Please provide an owner email",
        variant: "destructive",
      });
      return;
    }

    createStore.mutate({ storeName: newStoreName, email: ownerEmail });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              Owner Email {isSuperAdmin && "(Optional for Super Admin)"}
            </label>
            <Input
              id="owner-email"
              type="email"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              placeholder={isSuperAdmin ? "Enter owner email (optional)" : "Enter owner email"}
              required={!isSuperAdmin}
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
  );
};

export default CreateStoreDialog;
