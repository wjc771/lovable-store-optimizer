
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";

export const NotificationSettings = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.notifications')}</CardTitle>
        <CardDescription>{t('settings.notificationsDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label>{t('settings.emailNotifications')}</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={t('settings.selectEmailFrequency')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instant">{t('settings.instant')}</SelectItem>
              <SelectItem value="daily">{t('settings.dailyDigest')}</SelectItem>
              <SelectItem value="weekly">{t('settings.weeklySummary')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label>{t('settings.pushNotifications')}</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder={t('settings.selectNotificationType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('settings.allNotifications')}</SelectItem>
              <SelectItem value="important">{t('settings.importantOnly')}</SelectItem>
              <SelectItem value="none">{t('settings.disabled')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
