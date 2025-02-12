
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { BusinessReconciliationSettings } from "./BusinessReconciliationSettings";

export const BusinessSettings = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.business')}</CardTitle>
          <CardDescription>{t('settings.businessDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="salesThreshold">{t('settings.salesThreshold')}</label>
            <Input
              id="salesThreshold"
              type="number"
              placeholder={t('settings.salesThreshold')}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="inventoryAlert">{t('settings.inventoryAlert')}</label>
            <Input
              id="inventoryAlert"
              type="number"
              placeholder={t('settings.inventoryAlert')}
            />
          </div>
        </CardContent>
      </Card>

      <BusinessReconciliationSettings />
    </div>
  );
};
