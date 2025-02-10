
import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Users, BarChart3, Bell, Link } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Settings = () => {
  const [uploadWebhookUrl, setUploadWebhookUrl] = useState("");
  const [chatWebhookUrl, setChatWebhookUrl] = useState("");
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
