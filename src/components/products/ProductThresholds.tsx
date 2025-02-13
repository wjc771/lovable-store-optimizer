
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export function ProductThresholds() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('products.productThresholds')}</CardTitle>
        <CardDescription>{t('products.productThresholdsDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Interface será implementada aqui */}
        <p>Em desenvolvimento...</p>
      </CardContent>
    </Card>
  );
}
