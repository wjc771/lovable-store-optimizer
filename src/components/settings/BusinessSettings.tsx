
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { BusinessReconciliationSettings } from "./BusinessReconciliationSettings";
import { useStore } from "@/contexts/StoreContext";

export const BusinessSettings = () => {
  const { t } = useTranslation();
  const { store, updateStoreSettings } = useStore();
  const [salesThreshold, setSalesThreshold] = useState(
    store?.storeSettings?.business_preferences?.salesThreshold || 1000
  );
  const [inventoryAlert, setInventoryAlert] = useState(
    store?.storeSettings?.business_preferences?.inventoryAlert || 10
  );

  useEffect(() => {
    if (store?.storeSettings?.business_preferences) {
      setSalesThreshold(store.storeSettings.business_preferences.salesThreshold);
      setInventoryAlert(store.storeSettings.business_preferences.inventoryAlert);
    }
  }, [store?.storeSettings?.business_preferences]);

  const handleSave = async () => {
    await updateStoreSettings({
      business_preferences: {
        salesThreshold: Number(salesThreshold),
        inventoryAlert: Number(inventoryAlert)
      }
    });
  };

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
            <div className="flex gap-4">
              <Input
                id="salesThreshold"
                type="number"
                value={salesThreshold}
                onChange={(e) => setSalesThreshold(Number(e.target.value))}
                placeholder={t('settings.salesThreshold')}
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="inventoryAlert">{t('settings.inventoryAlert')}</label>
            <div className="flex gap-4">
              <Input
                id="inventoryAlert"
                type="number"
                value={inventoryAlert}
                onChange={(e) => setInventoryAlert(Number(e.target.value))}
                placeholder={t('settings.inventoryAlert')}
                className="flex-1"
              />
            </div>
          </div>
          <Button onClick={handleSave} className="mt-4">
            {t('common.save')}
          </Button>
        </CardContent>
      </Card>

      <BusinessReconciliationSettings />
    </div>
  );
};
