import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, Users, BarChart3, Bell, Link, UserPlus, Shield, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StaffForm } from "@/components/staff/StaffForm";
import { PositionForm } from "@/components/staff/PositionForm";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { BusinessSettings } from "@/components/settings/BusinessSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { IntegrationSettings } from "@/components/settings/IntegrationSettings";
import { StaffTable } from "@/components/settings/StaffTable";
import { PositionsTable } from "@/components/settings/PositionsTable";
import { Json } from "@/integrations/supabase/types";

export interface StaffMember {
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

interface SupabasePosition {
  id: string;
  name: string | null;
  is_managerial: boolean | null;
  permissions: Json;
}

const Settings = () => {
  const [uploadWebhookUrl, setUploadWebhookUrl] = useState("");
  const [chatWebhookUrl, setChatWebhookUrl] = useState("");
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [staffFormOpen, setStaffFormOpen] = useState(false);
  const [positionFormOpen, setPositionFormOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data: settingsData, error: settingsError } = await supabase
          .from('store_settings')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (settingsError) throw settingsError;

        if (settingsData) {
          setUploadWebhookUrl(settingsData.upload_webhook_url || "");
          setChatWebhookUrl(settingsData.chat_webhook_url || "");
        }

        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select(`
            id,
            name,
            status,
            staff_positions (
              position_id,
              positions (name)
            )
          `);

        if (staffError) throw staffError;

        if (staffData) {
          const typedStaffMembers: StaffMember[] = staffData.map(staff => ({
            id: staff.id,
            name: staff.name,
            status: staff.status as "active" | "inactive",
            positions: staff.staff_positions.map((sp: any) => sp.positions.name),
            position_ids: staff.staff_positions.map((sp: any) => sp.position_id)
          }));
          setStaffMembers(typedStaffMembers);
        }

        const { data: positionsData, error: positionsError } = await supabase
          .from('positions')
          .select('*');

        if (positionsError) throw positionsError;

        if (positionsData) {
          const typedPositions: Position[] = (positionsData as SupabasePosition[]).map(pos => {
            const permissionsData = pos.permissions as { [key: string]: boolean } || {};
            return {
              id: pos.id,
              name: pos.name || '',
              is_managerial: pos.is_managerial || false,
              permissions: {
                sales: permissionsData.sales || false,
                inventory: permissionsData.inventory || false,
                financial: permissionsData.financial || false,
                customers: permissionsData.customers || false,
                staff: permissionsData.staff || false,
                settings: permissionsData.settings || false
              }
            };
          });
          setPositions(typedPositions);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, [toast]);

  const handleSaveSettings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to save settings",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('store_settings')
        .upsert({
          user_id: session.user.id,
          upload_webhook_url: uploadWebhookUrl,
          chat_webhook_url: chatWebhookUrl,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    }
  };

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
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Business
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Staff & Permissions
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="business">
          <BusinessSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="staff">
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
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationSettings
            uploadWebhookUrl={uploadWebhookUrl}
            chatWebhookUrl={chatWebhookUrl}
            onUploadWebhookUrlChange={setUploadWebhookUrl}
            onChatWebhookUrlChange={setChatWebhookUrl}
            onSave={handleSaveSettings}
          />
        </TabsContent>
      </Tabs>

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
    </div>
  );
};

export default Settings;
