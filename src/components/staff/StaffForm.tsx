
import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { syncService } from "@/services/syncService";
import { useToast } from "@/hooks/use-toast";

interface Position {
  id: string;
  name: string;
  permissions: {
    sales: boolean;
    inventory: boolean;
    financial: boolean;
    customers: boolean;
    staff: boolean;
    settings: boolean;
  };
}

interface StaffFormData {
  id?: string;  // Adding optional id field
  name: string;
  status: "active" | "inactive";
  position_ids: string[];
}

interface StaffFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: StaffFormData) => void;
  initialData?: StaffFormData;
  positions: Position[];
}

export const StaffForm = ({ open, onOpenChange, onSubmit, initialData, positions }: StaffFormProps) => {
  const form = useForm<StaffFormData>({
    defaultValues: {
      name: "",
      status: "active",
      position_ids: [],
    },
  });
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        status: initialData.status,
        position_ids: initialData.position_ids || [],
      });
      setSelectedPositions(initialData.position_ids || []);
    } else {
      form.reset({
        name: "",
        status: "active",
        position_ids: [],
      });
      setSelectedPositions([]);
    }
  }, [initialData, form]);

  const handleSubmit = async (data: StaffFormData) => {
    try {
      const formData = {
        ...data,
        position_ids: selectedPositions,
      };

      // Queue the operation for sync
      await syncService.queueOperation({
        operationType: initialData ? 'update' : 'create',
        tableName: 'staff',
        recordId: initialData?.id,
        data: formData,
      });

      toast({
        title: `Staff member ${initialData ? 'updated' : 'added'}`,
        description: "Changes will be synchronized when online.",
      });

      onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving staff member:', error);
      toast({
        title: "Error",
        description: "Failed to save staff member. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Track selected positions
  const [selectedPositions, setSelectedPositions] = React.useState<string[]>(
    initialData?.position_ids || []
  );

  // Handle position toggle
  const togglePosition = (positionId: string) => {
    setSelectedPositions((current) => {
      const updated = current.includes(positionId)
        ? current.filter((id) => id !== positionId)
        : [...current, positionId];
      
      form.setValue("position_ids", updated);
      return updated;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Staff Member" : "Add Staff Member"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter staff member name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="position_ids"
              render={() => (
                <FormItem>
                  <FormLabel>Positions</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {positions.map((position) => (
                        <div
                          key={position.id}
                          className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer"
                          onClick={() => togglePosition(position.id)}
                        >
                          <span>{position.name}</span>
                          {selectedPositions.includes(position.id) ? (
                            <Badge variant="secondary">
                              <Check className="h-4 w-4" />
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              <X className="h-4 w-4" />
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">{initialData ? "Update" : "Add"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
