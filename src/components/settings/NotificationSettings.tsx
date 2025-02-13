
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { useStore } from "@/contexts/StoreContext";

export const NotificationSettings = () => {
  const { t } = useTranslation();
  const { store, updateStoreSettings } = useStore();
  const [emailFrequency, setEmailFrequency] = useState<'instant' | 'daily' | 'weekly'>(
    (store?.storeSettings?.notification_preferences?.emailFrequency as 'instant' | 'daily' | 'weekly') || 'daily'
  );
  const [pushNotifications, setPushNotifications] = useState<'all' | 'important' | 'none'>(
    (store?.storeSettings?.notification_preferences?.pushNotifications as 'all' | 'important' | 'none') || 'important'
  );

  useEffect(() => {
    if (store?.storeSettings?.notification_preferences) {
      setEmailFrequency(store.storeSettings.notification_preferences.emailFrequency as 'instant' | 'daily' | 'weekly');
      setPushNotifications(store.storeSettings.notification_preferences.pushNotifications as 'all' | 'important' | 'none');
    }
  }, [store?.storeSettings?.notification_preferences]);

  const handleEmailFrequencyChange = async (value: 'instant' | 'daily' | 'weekly') => {
    setEmailFrequency(value);
    await updateStoreSettings({
      notification_preferences: {
        emailFrequency: value,
        pushNotifications
      }
    });
  };

  const handlePushNotificationsChange = async (value: 'all' | 'important' | 'none') => {
    setPushNotifications(value);
    await updateStoreSettings({
      notification_preferences: {
        emailFrequency,
        pushNotifications: value
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.notifications')}</CardTitle>
        <CardDescription>{t('settings.notificationsDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label>{t('settings.emailNotifications')}</label>
          <Select value={emailFrequency} onValueChange={handleEmailFrequencyChange}>
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
          <Select value={pushNotifications} onValueChange={handlePushNotificationsChange}>
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
