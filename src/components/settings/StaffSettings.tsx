
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Shield, MoreVertical } from "lucide-react";
import { StaffTable } from "@/components/settings/StaffTable";
import { PositionsTable } from "@/components/settings/PositionsTable";
import { StaffForm } from "@/components/staff/StaffForm";
import { PositionForm } from "@/components/staff/PositionForm";
import { Position, StaffMember } from "@/types/settings";
import { useStaffManagement } from "@/hooks/useStaffManagement";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { TableSkeleton } from "@/components/settings/TableSkeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StaffSettingsProps {
  staffMembers: StaffMember[];
  positions: Position[];
  setStaffMembers: React.Dispatch<React.SetStateAction<StaffMember[]>>;
  setPositions: React.Dispatch<React.SetStateAction<Position[]>>;
}

export const StaffSettings: React.FC<StaffSettingsProps> = ({
  staffMembers: initialStaffMembers,
  positions: initialPositions,
  setStaffMembers: updateParentStaffMembers,
  setPositions: updateParentPositions,
}) => {
  const {
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
    isLoading,
  } = useStaffManagement(initialStaffMembers, initialPositions);

  const isMobile = useIsMobile();

  // Update parent state when local state changes
  React.useEffect(() => {
    updateParentStaffMembers(staffMembers);
  }, [staffMembers, updateParentStaffMembers]);

  React.useEffect(() => {
    updateParentPositions(positions);
  }, [positions, updateParentPositions]);

  return (
    <ErrorBoundary>
      <Card>
        <CardHeader>
          <CardTitle>Staff Management</CardTitle>
          <CardDescription>Manage staff members and their permissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-medium">Staff Members</h3>
            <Button
              onClick={() => {
                setSelectedStaff(null);
                setStaffFormOpen(true);
              }}
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Add Staff Member
            </Button>
          </div>

          {isLoading ? (
            <TableSkeleton columns={4} rows={3} />
          ) : (
            <StaffTable
              staffMembers={staffMembers}
              onEdit={(staff) => {
                setSelectedStaff(staff);
                setStaffFormOpen(true);
              }}
              onDelete={handleDeleteStaff}
              isMobile={isMobile}
            />
          )}

          <div className="mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h3 className="text-lg font-medium">Position Management</h3>
              <Button
                onClick={() => {
                  setSelectedPosition(null);
                  setPositionFormOpen(true);
                }}
                className="w-full sm:w-auto flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Add Position
              </Button>
            </div>
            {isLoading ? (
              <TableSkeleton columns={4} rows={3} />
            ) : (
              <PositionsTable
                positions={positions}
                onEdit={(position) => {
                  setSelectedPosition(position);
                  setPositionFormOpen(true);
                }}
                onDelete={handleDeletePosition}
                isMobile={isMobile}
              />
            )}
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
    </ErrorBoundary>
  );
};
