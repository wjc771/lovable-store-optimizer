import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Shield, Trash, Edit2, UserPlus, Crown, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface SuperAdmin {
  id: string;
  email: string;
  status: string;
  created_at: string;
}

interface RoleManagementProps {
  storeId?: string;
}

const RoleManagement: React.FC<RoleManagementProps> = ({ storeId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<SuperAdmin | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isSuperAdmin } = useAuth();
  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  const { data: superAdmins, isLoading: loadingAdmins, error: adminsError } = useQuery({
    queryKey: ["system-admins"],
    queryFn: async () => {
      if (!isSuperAdmin) {
        throw new Error("Only super admins can view this information");
      }

      const { data, error } = await supabase
        .from("system_admins")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching system admins:", error);
        throw new Error(error.message);
      }

      return data as SuperAdmin[];
    },
    enabled: isSuperAdmin,
  });

  const addSuperAdmin = useMutation({
    mutationFn: async (email: string) => {
      console.log("Adding super admin with email:", email);
      const { data, error } = await supabase
        .from("system_admins")
        .insert([
          {
            email: email,
            status: "active",
          },
        ])
        .select();

      if (error) {
        console.error("Error adding system admin:", error);
        throw new Error(error.message);
      }

      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-admins"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Super Admin added",
        description: "The user has been granted super admin privileges",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding Super Admin",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const updateAdminStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from("system_admins")
        .update({ status })
        .eq("id", id)
        .select();

      if (error) {
        console.error("Error updating admin status:", error);
        throw new Error(error.message);
      }

      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-admins"] });
      toast({
        title: "Status updated",
        description: "Admin status has been updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating status",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const removeAdmin = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("system_admins")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error removing admin:", error);
        throw new Error(error.message);
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-admins"] });
      toast({
        title: "Admin removed",
        description: "Super admin privileges have been revoked",
      });
    },
    onError: (error) => {
      toast({
        title: "Error removing admin",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: { email: string }) => {
    addSuperAdmin.mutate(data.email);
  };

  const toggleAdminStatus = (admin: SuperAdmin) => {
    const newStatus = admin.status === "active" ? "inactive" : "active";
    updateAdminStatus.mutate({ id: admin.id, status: newStatus });
  };

  const isJotaFieldsFirst = (email: string) => {
    return email === "jotafieldsfirst@gmail.com";
  };

  if (!isSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>You don't have permission to view this page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-amber-500 bg-amber-50 dark:bg-amber-950 p-4 rounded-md">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>Only super administrators can manage system roles</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>System Administrators</CardTitle>
          <CardDescription>Manage users with system-wide access</CardDescription>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Super Admin
        </Button>
      </CardHeader>
      <CardContent>
        {adminsError ? (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
              <h3 className="text-lg font-semibold">Error loading administrators</h3>
            </div>
            <p className="mt-2">{adminsError instanceof Error ? adminsError.message : "Unknown error"}</p>
          </div>
        ) : loadingAdmins ? (
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {superAdmins && superAdmins.length > 0 ? (
                  superAdmins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium flex items-center gap-2">
                        <Crown className={`h-4 w-4 ${isJotaFieldsFirst(admin.email) ? "text-yellow-500" : "text-blue-500"}`} />
                        {admin.email}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={admin.status === "active"}
                            onCheckedChange={() => toggleAdminStatus(admin)}
                            disabled={isJotaFieldsFirst(admin.email)}
                            aria-label="Toggle admin status"
                          />
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              admin.status === "active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                            }`}
                          >
                            {admin.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(admin.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={isJotaFieldsFirst(admin.email)}
                            >
                              <Trash className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Revoke Super Admin Access</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove super admin privileges from {admin.email}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => removeAdmin.mutate(admin.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Remove Access
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      <p className="text-muted-foreground">No administrators found</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Super Administrator</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@example.com" {...field} type="email" required />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={addSuperAdmin.isPending}>
                    {addSuperAdmin.isPending ? "Adding..." : "Add Administrator"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default RoleManagement;
