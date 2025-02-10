
import React, { useState, useEffect } from "react";
import { Settings as SettingsIcon, Users, BarChart3, Bell, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { BusinessSettings } from "@/components/settings/BusinessSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { IntegrationSettings } from "@/components/settings/IntegrationSettings";
import { StaffSettings } from "@/components/settings/StaffSettings";
import { Position, StaffMember } from "@/types/settings";
import { Json } from "@/integrations/supabase/types";

const Settings = () => {
  const [uploadWebhookUrl, setUploadWebhookUrl] = useState("");
  const [chatWebhookUrl, setChatWebhookUrl] = useState("");
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
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
          const typedPositions: Position[] = positionsData.map(pos => {
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
          <StaffSettings
            staffMembers={staffMembers}
            positions={positions}
            setStaffMembers={setStaffMembers}
            setPositions={setPositions}
          />
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
    </div>
  );
};

export default Settings;
