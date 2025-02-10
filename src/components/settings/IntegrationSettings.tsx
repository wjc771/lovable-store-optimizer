
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface IntegrationSettingsProps {
  uploadWebhookUrl: string;
  chatWebhookUrl: string;
  onUploadWebhookUrlChange: (value: string) => void;
  onChatWebhookUrlChange: (value: string) => void;
  onSave: () => void;
}

export const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({
  uploadWebhookUrl,
  chatWebhookUrl,
  onUploadWebhookUrlChange,
  onChatWebhookUrlChange,
  onSave,
}) => {
  return (
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
            onChange={(e) => onUploadWebhookUrlChange(e.target.value)}
            placeholder="Enter upload webhook URL"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="chatWebhook">Chat Webhook URL</label>
          <Input
            id="chatWebhook"
            value={chatWebhookUrl}
            onChange={(e) => onChatWebhookUrlChange(e.target.value)}
            placeholder="Enter chat webhook URL"
          />
        </div>
        <Button onClick={onSave}>Save Settings</Button>
      </CardContent>
    </Card>
  );
};
