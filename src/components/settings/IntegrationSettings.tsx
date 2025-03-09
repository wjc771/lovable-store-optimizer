
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export interface IntegrationSettingsProps {
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
  
  const [localUploadWebhook, setLocalUploadWebhook] = useState(uploadWebhookUrl);
  const [localChatWebhook, setLocalChatWebhook] = useState(chatWebhookUrl);

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalUploadWebhook(e.target.value);
    onUploadWebhookUrlChange(e.target.value);
  };

  const handleChatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalChatWebhook(e.target.value);
    onChatWebhookUrlChange(e.target.value);
  };

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
            value={localUploadWebhook}
            onChange={handleUploadChange}
            placeholder={t('settings.enterUploadWebhookUrl')}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="chatWebhook">{t('settings.chatWebhookUrl')}</label>
          <Input
            id="chatWebhook"
            value={localChatWebhook}
            onChange={handleChatChange}
            placeholder={t('settings.enterChatWebhookUrl')}
          />
        </div>
        <Button onClick={onSave}>{t('common.save')}</Button>
      </CardContent>
    </Card>
  );
};
