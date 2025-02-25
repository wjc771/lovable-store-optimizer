import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

interface StoreData {
  id: string;
  business_name: string;
  status: string;
  created_at: string;
  owner_id: string | null;
}

interface StaffMember {
  id: string;
  name: string;
  user_id: string;
  status: string;
  email?: string;
  role?: string;
}

const StoreDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch store details
  const { data: store, isLoading: isLoadingStore } = useQuery({
    queryKey: ["store", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stores")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as StoreData;
    },
  });

  // Fetch staff members with profiles
  const { data: staff, isLoading: isLoadingStaff } = useQuery({
    queryKey: ["store-staff", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("staff")
        .select(`
          id,
          name,
          user_id,
          status,
          profiles:user_id (
            email
          )
        `)
        .eq("store_id", id);

      if (error) throw error;

      // Transform the data to match StaffMember interface
      return (data || []).map(staff => ({
        id: staff.id,
        name: staff.name,
        user_id: staff.user_id,
        status: staff.status,
        email: staff.profiles?.email,
        role: 'staff' // Default role
      })) as StaffMember[];
    },
  });

  // Invite staff mutation
  const inviteStaff = useMutation({
    mutationFn: async (email: string) => {
      if (!id) throw new Error("Store ID is required");

      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Token expires in 7 days

      const { error } = await supabase.from("store_invites").insert([
        {
          store_id: id,
          email,
          role: "staff",
          token,
          expires_at: expiresAt.toISOString(),
        },
      ]);

      if (error) throw error;
      return token;
    },
    onSuccess: (token) => {
      queryClient.invalidateQueries({ queryKey: ["store-staff", id] });
      setIsInviteDialogOpen(false);
      setNewStaffEmail("");
      
      toast({
        title: "Invitation sent",
        description: `Invite link: ${window.location.origin}/auth?token=${token}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error sending invitation",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    },
  });

  // Update store status mutation
  const updateStoreStatus = useMutation({
    mutationFn: async (newStatus: string) => {
      const { error } = await supabase
        .from("stores")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store", id] });
      toast({
        title: "Store status updated",
        description: "The store status has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating store status",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    },
  });

  if (isLoadingStore || isLoadingStaff) {
    return <div>Loading...</div>;
  }

  if (!store) {
    return <div>Store not found</div>;
  }

  const handleInviteStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffEmail) {
      toast({
        title: "Email required",
        description: "Please provide an email address",
        variant: "destructive",
      });
      return;
    }

    inviteStaff.mutate(newStaffEmail);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{store.business_name}</h1>
          <p className="text-muted-foreground">Store Management</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/stores")}>
          Back to Stores
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Basic information about the store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Status</p>
              <Badge
                variant={store.status === "active" ? "default" : "secondary"}
                className="mt-1"
              >
                {store.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Created At</p>
              <p className="text-sm text-muted-foreground">
                {new Date(store.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() =>
                  updateStoreStatus.mutate(
                    store.status === "active" ? "inactive" : "active"
                  )
                }
                disabled={updateStoreStatus.isPending}
              >
                {store.status === "active" ? "Deactivate" : "Activate"} Store
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Staff Members</CardTitle>
                <CardDescription>Manage store staff</CardDescription>
              </div>
              <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Invite Staff
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Staff Member</DialogTitle>
                    <DialogDescription>
                      Send an invitation to a new staff member.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleInviteStaff} className="space-y-4 pt-4">
                    <div>
                      <label
                        htmlFor="staff-email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Email Address
                      </label>
                      <Input
                        id="staff-email"
                        type="email"
                        value={newStaffEmail}
                        onChange={(e) => setNewStaffEmail(e.target.value)}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsInviteDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={inviteStaff.isPending}>
                        {inviteStaff.isPending ? "Sending..." : "Send Invitation"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {staff?.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                  <Badge>{member.status}</Badge>
                </div>
              ))}
              {(!staff || staff.length === 0) && (
                <p className="text-muted-foreground text-center py-4">
                  No staff members yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StoreDetails;
