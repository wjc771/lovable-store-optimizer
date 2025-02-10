
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";

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

  const handleSubmit = (data: any) => {
    onSubmit(data);
    onOpenChange(false);
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
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="capitalize">{permission}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
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
