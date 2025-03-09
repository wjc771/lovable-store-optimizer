
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export const NotificationSettings: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.notificationSettings')}</CardTitle>
        <CardDescription>{t('settings.notificationsDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{t('settings.notImplemented')}</p>
      </CardContent>
    </Card>
  );
};
