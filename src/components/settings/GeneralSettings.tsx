
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { useStore } from "@/contexts/StoreContext";

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney'
];

export const GeneralSettings = () => {
  const { t } = useTranslation();
  const { store, updateStoreName, updateStoreSettings } = useStore();
  const [businessName, setBusinessName] = useState(store?.businessName || '');
  const [timezone, setTimezone] = useState(store?.storeSettings?.general_preferences?.timezone || 'UTC');

  useEffect(() => {
    if (store?.businessName) {
      setBusinessName(store.businessName);
    }
    if (store?.storeSettings?.general_preferences?.timezone) {
      setTimezone(store.storeSettings.general_preferences.timezone);
    }
  }, [store?.businessName, store?.storeSettings?.general_preferences?.timezone]);

  const handleSave = async () => {
    if (businessName.trim()) {
      await updateStoreName(businessName.trim());
    }
  };

  const handleTimezoneChange = async (value: string) => {
    setTimezone(value);
    await updateStoreSettings({
      general_preferences: {
        timezone: value
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.general')}</CardTitle>
        <CardDescription>{t('settings.generalDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="businessName">{t('settings.businessName')}</label>
          <div className="flex gap-4">
            <Input
              id="businessName"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder={t('settings.enterBusinessName')}
              className="flex-1"
            />
            <Button onClick={handleSave}>{t('common.save')}</Button>
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="timezone">{t('settings.timezone')}</label>
          <Select value={timezone} onValueChange={handleTimezoneChange}>
            <SelectTrigger id="timezone">
              <SelectValue placeholder={t('settings.selectTimezone')} />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
