
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { StaffMember, Position } from "@/types/settings";
import * as staffService from "@/services/staffService";
import * as positionService from "@/services/positionService";

export const useStaffManagement = (
  initialStaff: StaffMember[],
  initialPositions: Position[]
) => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(initialStaff);
  const [positions, setPositions] = useState<Position[]>(initialPositions);
  const [staffFormOpen, setStaffFormOpen] = useState(false);
  const [positionFormOpen, setPositionFormOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const { toast } = useToast();

  const handleAddStaff = async (data: any) => {
    try {
      const newStaffMember = await staffService.addStaffMember(data);
      setStaffMembers(prev => [...prev, newStaffMember]);
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
      const updated = await staffService.updateStaffMember(selectedStaff.id, data);
      setStaffMembers(prev => prev.map(staff =>
        staff.id === selectedStaff.id
          ? {
              ...staff,
              name: data.name,
              status: data.status as "active" | "inactive",
              positions: updated.positions,
              position_ids: updated.position_ids,
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
      await staffService.deleteStaffMember(id);
      setStaffMembers(prev => prev.filter(staff => staff.id !== id));
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
      const newPosition = await positionService.addPosition(data);
      setPositions(prev => [...prev, newPosition]);
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
      await positionService.updatePosition(selectedPosition.id, data);
      setPositions(prev => prev.map(position =>
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
      await positionService.deletePosition(id);
      setPositions(prev => prev.filter(position => position.id !== id));
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

  return {
    staffMembers,
    positions,
    staffFormOpen,
    positionFormOpen,
    selectedStaff,
    selectedPosition,
    setStaffFormOpen,
    setPositionFormOpen,
    setSelectedStaff,
    setSelectedPosition,
    handleAddStaff,
    handleUpdateStaff,
    handleDeleteStaff,
    handleAddPosition,
    handleUpdatePosition,
    handleDeletePosition,
  };
};
