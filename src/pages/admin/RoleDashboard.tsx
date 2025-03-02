
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import RoleManagement from "@/components/admin/RoleManagement";
import { StaffSettings } from "@/components/settings/StaffSettings";
import { AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface StaffMember {
  id: string;
  name: string;
  status: "active" | "inactive";
  positions: string[];
  position_ids: string[];
}

interface Position {
  id: string;
  name: string;
  is_managerial: boolean;
  permissions: {
    sales: boolean;
    inventory: boolean;
    financial: boolean;
    customers: boolean;
    staff: boolean;
    settings: boolean;
  };
}

const RoleDashboard = () => {
  const { storeId } = useParams();
  const { user } = useAuth();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [activeTab, setActiveTab] = useState<string>("system");

  const { isLoading, error } = useQuery({
    queryKey: ["role-data", storeId],
    queryFn: async () => {
      if (!storeId) {
        // System-level view doesn't need store-specific data
        return { staff: [], positions: [] };
      }

      // Fetch staff for this store
      const { data: staffData, error: staffError } = await supabase
        .from("staff")
        .select(`
          id,
          name,
          status,
          staff_positions!inner (
            position_id,
            positions (
              id,
              name
            )
          )
        `)
        .eq("store_id", storeId);

      if (staffError) {
        console.error("Error fetching staff:", staffError);
        throw new Error(staffError.message);
      }

      // Format staff data
      const formattedStaff: StaffMember[] = staffData.map((staff) => ({
        id: staff.id,
        name: staff.name,
        status: staff.status as "active" | "inactive",
        positions: staff.staff_positions.map((sp: any) => sp.positions.name),
        position_ids: staff.staff_positions.map((sp: any) => sp.position_id),
      }));

      // Fetch positions for this store
      const { data: positionsData, error: positionsError } = await supabase
        .from("positions")
        .select("*")
        .eq("store_department_id", storeId);

      if (positionsError) {
        console.error("Error fetching positions:", positionsError);
        throw new Error(positionsError.message);
      }

      setStaffMembers(formattedStaff);
      setPositions(positionsData);

      return { staff: formattedStaff, positions: positionsData };
    },
    enabled: !!storeId,
  });

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Role Management</h1>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="system">System Administrators</TabsTrigger>
          {storeId && <TabsTrigger value="store">Store Staff & Positions</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="system">
          <RoleManagement />
        </TabsContent>
        
        {storeId && (
          <TabsContent value="store">
            {error ? (
              <Card>
                <CardHeader>
                  <CardTitle>Error</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-red-500 bg-red-50 dark:bg-red-950 p-4 rounded-md">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <p>{error instanceof Error ? error.message : "An error occurred loading store data"}</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <StaffSettings 
                staffMembers={staffMembers}
                positions={positions}
                setStaffMembers={setStaffMembers}
                setPositions={setPositions}
              />
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default RoleDashboard;
