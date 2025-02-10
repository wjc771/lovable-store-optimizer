
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.webhookConfiguration')}</CardTitle>
        <CardDescription>{t('settings.integrationsDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="uploadWebhook">{t('settings.uploadWebhookUrl')}</label>
          <Input
            id="uploadWebhook"
            value={uploadWebhookUrl}
            onChange={(e) => onUploadWebhookUrlChange(e.target.value)}
            placeholder={t('settings.enterUploadWebhookUrl')}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="chatWebhook">{t('settings.chatWebhookUrl')}</label>
          <Input
            id="chatWebhook"
            value={chatWebhookUrl}
            onChange={(e) => onChatWebhookUrlChange(e.target.value)}
            placeholder={t('settings.enterChatWebhookUrl')}
          />
        </div>
        <Button onClick={onSave}>{t('common.save')}</Button>
      </CardContent>
    </Card>
  );
};
