
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
          .single();

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
    </div>
  );
};

export default Settings;
