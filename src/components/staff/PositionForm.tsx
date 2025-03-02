
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Shield, Crown } from "lucide-react";

interface PositionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

export const PositionForm = ({ open, onOpenChange, onSubmit, initialData }: PositionFormProps) => {
  const form = useForm({
    defaultValues: initialData || {
      name: "",
      is_managerial: false,
      permissions: {
        sales: false,
        inventory: false,
        financial: false,
        customers: false,
        staff: false,
        settings: false,
      },
    },
  });
  const { toast } = useToast();

  const isManagerial = form.watch("is_managerial");

  const handleSubmit = async (data: any) => {
    try {
      onSubmit(data);
      onOpenChange(false);
      toast({
        title: `Position ${initialData ? 'updated' : 'added'}`,
        description: "Changes have been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving position:', error);
      toast({
        title: "Error",
        description: "Failed to save position. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Position" : "Add Position"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter position name" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_managerial"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center">
                        {field.value ? (
                          <>
                            <Crown className="h-4 w-4 mr-1 text-yellow-500" />
                            Admin Role (Full Store Access)
                          </>
                        ) : (
                          <>
                            <Shield className="h-4 w-4 mr-1 text-blue-500" />
                            Staff Role (Limited Access)
                          </>
                        )}
                      </FormLabel>
                    </div>
                  </div>
                  <FormDescription className="pl-6">
                    {field.value 
                      ? "Admins have complete control over the store, including staff management and settings."
                      : "Staff members have limited access based on assigned permissions below."}
                  </FormDescription>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Permissions</FormLabel>
              {Object.keys(form.getValues().permissions).map((permission) => (
                <FormField
                  key={permission}
                  control={form.control}
                  name={`permissions.${permission}`}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={isManagerial || field.value}
                          onCheckedChange={field.onChange}
                          disabled={isManagerial}
                        />
                      </FormControl>
                      <FormLabel className="capitalize">{permission}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
              {isManagerial && (
                <FormDescription className="text-sm text-amber-500">
                  Admin roles automatically have all permissions enabled
                </FormDescription>
              )}
            </div>
            <DialogFooter>
              <Button type="submit">{initialData ? "Update" : "Add"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
