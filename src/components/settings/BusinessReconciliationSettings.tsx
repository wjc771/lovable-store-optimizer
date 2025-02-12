
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ReconciliationSettings {
  threshold: number;
  autoResolve: boolean;
  defaultResolution: 'system' | 'uploaded' | 'manual';
}

export const BusinessReconciliationSettings = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [settings, setSettings] = useState<ReconciliationSettings>({
    threshold: 5,
    autoResolve: false,
    defaultResolution: 'manual'
  });

  useEffect(() => {
    const loadSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: storeSettings } = await supabase
        .from('store_settings')
        .select('reconciliation_settings')
        .eq('user_id', user.id)
        .maybeSingle();

      if (storeSettings?.reconciliation_settings) {
        setSettings(storeSettings.reconciliation_settings as ReconciliationSettings);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<ReconciliationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('store_settings')
      .update({ reconciliation_settings: updatedSettings })
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
    }
  };

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
              value={settings.threshold}
              onChange={(e) => updateSettings({ threshold: Number(e.target.value) })}
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
            <Switch
              checked={settings.autoResolve}
              onCheckedChange={(checked) => updateSettings({ autoResolve: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('settings.reconciliation.defaultResolution')}</Label>
            <Select
              value={settings.defaultResolution}
              onValueChange={(value: 'system' | 'uploaded' | 'manual') => 
                updateSettings({ defaultResolution: value })
              }
            >
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

