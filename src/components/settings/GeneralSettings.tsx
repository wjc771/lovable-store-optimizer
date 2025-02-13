
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useStore } from "@/contexts/StoreContext";

export const GeneralSettings = () => {
  const { t } = useTranslation();
  const { store, updateStoreName } = useStore();
  const [businessName, setBusinessName] = useState(store?.businessName || '');

  useEffect(() => {
    if (store?.businessName) {
      setBusinessName(store.businessName);
    }
  }, [store?.businessName]);

  const handleSave = async () => {
    if (businessName.trim()) {
      await updateStoreName(businessName.trim());
    }
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
          <Input
            id="timezone"
            placeholder={t('settings.selectTimezone')}
          />
        </div>
      </CardContent>
    </Card>
  );
};
