
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const BusinessReconciliationSettings = () => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('settings.reconciliation.title')}</CardTitle>
        <CardDescription>{t('settings.reconciliation.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="threshold">{t('settings.reconciliation.threshold')}</Label>
            <Input
              id="threshold"
              type="number"
              placeholder="Enter threshold percentage"
            />
            <p className="text-sm text-muted-foreground">
              {t('settings.reconciliation.thresholdDescription')}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.reconciliation.autoResolve')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('settings.reconciliation.autoResolveDescription')}
              </p>
            </div>
            <Switch />
          </div>

          <div className="space-y-2">
            <Label>{t('settings.reconciliation.defaultResolution')}</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={t('settings.reconciliation.selectResolution')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">{t('settings.reconciliation.systemValue')}</SelectItem>
                <SelectItem value="uploaded">{t('settings.reconciliation.uploadedValue')}</SelectItem>
                <SelectItem value="manual">{t('settings.reconciliation.manualReview')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
