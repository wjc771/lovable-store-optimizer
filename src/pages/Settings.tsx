
import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Users, BarChart3, Bell, Link, UserPlus, Shield, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface StaffMember {
  id: string;
  name: string;
  status: string;
  positions: string[];
}

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

const Settings = () => {
  const [uploadWebhookUrl, setUploadWebhookUrl] = useState("");
  const [chatWebhookUrl, setChatWebhookUrl] = useState("");
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const { toast } = useToast();

  // Load existing settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('store_settings')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setUploadWebhookUrl(data.upload_webhook_url || "");
          setChatWebhookUrl(data.chat_webhook_url || "");
        }

        // Load staff members
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
          setStaffMembers(staffData.map(staff => ({
            id: staff.id,
            name: staff.name,
            status: staff.status,
            positions: staff.staff_positions.map((sp: any) => sp.positions.name)
          })));
        }

        // Load positions
        const { data: positionsData, error: positionsError } = await supabase
          .from('positions')
          .select('*');

        if (positionsError) throw positionsError;

        if (positionsData) {
          setPositions(positionsData);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
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
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure your basic application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="dailySummary">Daily Summary Mode</label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="dailySummary"
                    placeholder="Configure daily summary preferences"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Control</CardTitle>
              <CardDescription>Manage your business settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="salesThreshold">Sales Alert Threshold</label>
                <Input
                  id="salesThreshold"
                  placeholder="Set sales threshold for alerts"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="inventoryAlert">Inventory Alert Level</label>
                <Input
                  id="inventoryAlert"
                  placeholder="Set minimum inventory level"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="mobileNotifications">Mobile Notifications</label>
                <Input
                  id="mobileNotifications"
                  placeholder="Configure mobile notification settings"
                />
              </div>
            </CardContent>
          </Card>
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
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Staff Member
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position(s)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staffMembers.map((staff) => (
                    <TableRow key={staff.id}>
                      <TableCell>{staff.name}</TableCell>
                      <TableCell>{staff.positions.join(", ")}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {staff.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Shield className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Position Management</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Position</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {positions.map((position) => (
                      <TableRow key={position.id}>
                        <TableCell>{position.name}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {Object.entries(position.permissions).map(([key, value]) => (
                              value && (
                                <span key={key} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {key}
                                </span>
                              )
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Lock className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>Configure your webhook URLs for different services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="uploadWebhook">Upload Webhook URL</label>
                <Input
                  id="uploadWebhook"
                  value={uploadWebhookUrl}
                  onChange={(e) => setUploadWebhookUrl(e.target.value)}
                  placeholder="Enter upload webhook URL"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="chatWebhook">Chat Webhook URL</label>
                <Input
                  id="chatWebhook"
                  value={chatWebhookUrl}
                  onChange={(e) => setChatWebhookUrl(e.target.value)}
                  placeholder="Enter chat webhook URL"
                />
              </div>
              <Button onClick={handleSave}>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
