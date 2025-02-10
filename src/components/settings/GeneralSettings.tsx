
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

export const GeneralSettings = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.general')}</CardTitle>
        <CardDescription>{t('settings.generalDescription', 'Configure your basic application settings')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="businessName">{t('settings.businessName')}</label>
          <Input
            id="businessName"
            placeholder={t('settings.enterBusinessName', 'Enter your business name')}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="timezone">{t('settings.timezone')}</label>
          <Input
            id="timezone"
            placeholder={t('settings.selectTimezone', 'Select timezone')}
          />
        </div>
      </CardContent>
    </Card>
  );
};
