
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Shield } from "lucide-react";
import { StaffTable } from "@/components/settings/StaffTable";
import { PositionsTable } from "@/components/settings/PositionsTable";
import { StaffForm } from "@/components/staff/StaffForm";
import { PositionForm } from "@/components/staff/PositionForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Position } from "@/types/settings";
import { StaffMember } from "@/types/settings";

interface StaffSettingsProps {
  staffMembers: StaffMember[];
  positions: Position[];
  setStaffMembers: React.Dispatch<React.SetStateAction<StaffMember[]>>;
  setPositions: React.Dispatch<React.SetStateAction<Position[]>>;
}

export const StaffSettings: React.FC<StaffSettingsProps> = ({
  staffMembers,
  positions,
  setStaffMembers,
  setPositions,
}) => {
  const [staffFormOpen, setStaffFormOpen] = useState(false);
  const [positionFormOpen, setPositionFormOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const { toast } = useToast();

  const handleAddStaff = async (data: any) => {
    try {
      const { data: newStaff, error } = await supabase
        .from('staff')
        .insert([{
          name: data.name,
          status: data.status,
        }])
        .select()
        .single();

      if (error) throw error;

      if (data.position_ids && data.position_ids.length > 0) {
        const staffPositionsToInsert = data.position_ids.map((positionId: string) => ({
          staff_id: newStaff.id,
          position_id: positionId,
        }));

        const { error: positionsError } = await supabase
          .from('staff_positions')
          .insert(staffPositionsToInsert);

        if (positionsError) throw positionsError;
      }

      const { data: staffPositions } = await supabase
        .from('staff_positions')
        .select(`
          position_id,
          positions (name)
        `)
        .eq('staff_id', newStaff.id);

      const newStaffMember: StaffMember = {
        id: newStaff.id,
        name: newStaff.name,
        status: newStaff.status as "active" | "inactive",
        positions: staffPositions?.map((sp: any) => sp.positions.name) || [],
        position_ids: staffPositions?.map((sp: any) => sp.position_id) || [],
      };

      setStaffMembers([...staffMembers, newStaffMember]);
      setStaffFormOpen(false);

      toast({
        title: "Success",
        description: "Staff member added successfully",
      });
    } catch (error) {
      console.error("Error adding staff:", error);
      toast({
        title: "Error",
        description: "Failed to add staff member",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStaff = async (data: any) => {
    if (!selectedStaff) return;

    try {
      const { error } = await supabase
        .from('staff')
        .update({
          name: data.name,
          status: data.status,
        })
        .eq('id', selectedStaff.id);

      if (error) throw error;

      const { error: deleteError } = await supabase
        .from('staff_positions')
        .delete()
        .eq('staff_id', selectedStaff.id);

      if (deleteError) throw deleteError;

      if (data.position_ids && data.position_ids.length > 0) {
        const staffPositionsToInsert = data.position_ids.map((positionId: string) => ({
          staff_id: selectedStaff.id,
          position_id: positionId,
        }));

        const { error: insertError } = await supabase
          .from('staff_positions')
          .insert(staffPositionsToInsert);

        if (insertError) throw insertError;
      }

      const { data: staffPositions } = await supabase
        .from('staff_positions')
        .select(`
          position_id,
          positions (name)
        `)
        .eq('staff_id', selectedStaff.id);

      setStaffMembers(staffMembers.map(staff =>
        staff.id === selectedStaff.id
          ? {
              ...staff,
              name: data.name,
              status: data.status as "active" | "inactive",
              positions: staffPositions?.map((sp: any) => sp.positions.name) || [],
              position_ids: staffPositions?.map((sp: any) => sp.position_id) || [],
            }
          : staff
      ));
      setStaffFormOpen(false);

      toast({
        title: "Success",
        description: "Staff member updated successfully",
      });
    } catch (error) {
      console.error("Error updating staff:", error);
      toast({
        title: "Error",
        description: "Failed to update staff member",
        variant: "destructive",
      });
    }
  };

  const handleDeleteStaff = async (id: string) => {
    try {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStaffMembers(staffMembers.filter(staff => staff.id !== id));

      toast({
        title: "Success",
        description: "Staff member deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast({
        title: "Error",
        description: "Failed to delete staff member",
        variant: "destructive",
      });
    }
  };

  const handleAddPosition = async (data: any) => {
    try {
      const permissionsData = {
        sales: data.permissions.sales || false,
        inventory: data.permissions.inventory || false,
        financial: data.permissions.financial || false,
        customers: data.permissions.customers || false,
        staff: data.permissions.staff || false,
        settings: data.permissions.settings || false
      };

      const { data: newPosition, error } = await supabase
        .from('positions')
        .insert([{
          name: data.name,
          is_managerial: data.is_managerial,
          permissions: permissionsData,
        }])
        .select()
        .single();

      if (error) throw error;

      const typedPosition: Position = {
        id: newPosition.id,
        name: newPosition.name || '',
        is_managerial: newPosition.is_managerial || false,
        permissions: permissionsData
      };

      setPositions([...positions, typedPosition]);
      setPositionFormOpen(false);

      toast({
        title: "Success",
        description: "Position added successfully",
      });
    } catch (error) {
      console.error("Error adding position:", error);
      toast({
        title: "Error",
        description: "Failed to add position",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePosition = async (data: any) => {
    if (!selectedPosition) return;

    try {
      const { error } = await supabase
        .from('positions')
        .update({
          name: data.name,
          is_managerial: data.is_managerial,
          permissions: data.permissions,
        })
        .eq('id', selectedPosition.id);

      if (error) throw error;

      setPositions(positions.map(position =>
        position.id === selectedPosition.id
          ? {
              ...position,
              name: data.name,
              is_managerial: data.is_managerial,
              permissions: data.permissions,
            }
          : position
      ));
      setPositionFormOpen(false);

      toast({
        title: "Success",
        description: "Position updated successfully",
      });
    } catch (error) {
      console.error("Error updating position:", error);
      toast({
        title: "Error",
        description: "Failed to update position",
        variant: "destructive",
      });
    }
  };

  const handleDeletePosition = async (id: string) => {
    try {
      const { error } = await supabase
        .from('positions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPositions(positions.filter(position => position.id !== id));

      toast({
        title: "Success",
        description: "Position deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting position:", error);
      toast({
        title: "Error",
        description: "Failed to delete position",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Management</CardTitle>
        <CardDescription>Manage staff members and their permissions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Staff Members</h3>
          <Button onClick={() => {
            setSelectedStaff(null);
            setStaffFormOpen(true);
          }} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Staff Member
          </Button>
        </div>
        
        <StaffTable
          staffMembers={staffMembers}
          onEdit={(staff) => {
            setSelectedStaff(staff);
            setStaffFormOpen(true);
          }}
          onDelete={handleDeleteStaff}
        />

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Position Management</h3>
            <Button onClick={() => {
              setSelectedPosition(null);
              setPositionFormOpen(true);
            }} className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Add Position
            </Button>
          </div>
          <PositionsTable
            positions={positions}
            onEdit={(position) => {
              setSelectedPosition(position);
              setPositionFormOpen(true);
            }}
            onDelete={handleDeletePosition}
          />
        </div>
      </CardContent>

      <StaffForm
        open={staffFormOpen}
        onOpenChange={setStaffFormOpen}
        onSubmit={selectedStaff ? handleUpdateStaff : handleAddStaff}
        initialData={selectedStaff}
        positions={positions}
      />

      <PositionForm
        open={positionFormOpen}
        onOpenChange={setPositionFormOpen}
        onSubmit={selectedPosition ? handleUpdatePosition : handleAddPosition}
        initialData={selectedPosition}
      />
    </Card>
  );
};
