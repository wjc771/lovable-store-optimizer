
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SmartActionThresholds {
  revenue_alert_threshold: number;
  revenue_alert_percentage: number;
  inventory_low_threshold: number;
  inventory_critical_threshold: number;
  payment_reminder_days: number;
}

const DEFAULT_THRESHOLDS: SmartActionThresholds = {
  revenue_alert_threshold: 10000,
  revenue_alert_percentage: 20,
  inventory_low_threshold: 10,
  inventory_critical_threshold: 5,
  payment_reminder_days: 7,
};

export function SmartActionsSettings() {
  const [thresholds, setThresholds] = useState<SmartActionThresholds>(DEFAULT_THRESHOLDS);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    loadThresholds();
  }, []);

  const loadThresholds = async () => {
    try {
      // First get the store_id for the current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: staffData } = await supabase
        .from('staff')
        .select('store_id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!staffData?.store_id) return;

      const { data: thresholdsData, error } = await supabase
        .from('smart_action_thresholds')
        .select('*')
        .eq('store_id', staffData.store_id)
        .maybeSingle();

      if (error) throw error;

      if (thresholdsData) {
        setThresholds({
          revenue_alert_threshold: thresholdsData.revenue_alert_threshold,
          revenue_alert_percentage: thresholdsData.revenue_alert_percentage,
          inventory_low_threshold: thresholdsData.inventory_low_threshold,
          inventory_critical_threshold: thresholdsData.inventory_critical_threshold,
          payment_reminder_days: thresholdsData.payment_reminder_days,
        });
      }
    } catch (error) {
      console.error('Error loading thresholds:', error);
      toast({
        title: t('common.error'),
        description: t('settings.errorLoadingThresholds'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: staffData } = await supabase
        .from('staff')
        .select('store_id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (!staffData?.store_id) return;

      const { error } = await supabase
        .from('smart_action_thresholds')
        .upsert({
          store_id: staffData.store_id,
          ...thresholds
        });

      if (error) throw error;

      toast({
        title: t('common.success'),
        description: t('settings.thresholdsSaved'),
      });
    } catch (error) {
      console.error('Error saving thresholds:', error);
      toast({
        title: t('common.error'),
        description: t('settings.errorSavingThresholds'),
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setThresholds(DEFAULT_THRESHOLDS);
  };

  if (loading) {
    return <div className="space-y-4">
      <div className="h-32 animate-pulse bg-gray-100 rounded-lg" />
      <div className="h-32 animate-pulse bg-gray-100 rounded-lg" />
      <div className="h-32 animate-pulse bg-gray-100 rounded-lg" />
    </div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.revenueAlerts')}</CardTitle>
          <CardDescription>{t('settings.revenueAlertsDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-sm font-medium">{t('settings.revenueThreshold')}</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={thresholds.revenue_alert_threshold}
                  onChange={(e) => setThresholds(prev => ({
                    ...prev,
                    revenue_alert_threshold: Number(e.target.value)
                  }))}
                />
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('settings.revenueThresholdTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">{t('settings.percentageChange')}</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={thresholds.revenue_alert_percentage}
                  onChange={(e) => setThresholds(prev => ({
                    ...prev,
                    revenue_alert_percentage: Number(e.target.value)
                  }))}
                />
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('settings.percentageChangeTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.inventoryAlerts')}</CardTitle>
          <CardDescription>{t('settings.inventoryAlertsDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-sm font-medium">{t('settings.lowThreshold')}</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={thresholds.inventory_low_threshold}
                  onChange={(e) => setThresholds(prev => ({
                    ...prev,
                    inventory_low_threshold: Number(e.target.value)
                  }))}
                />
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('settings.lowThresholdTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium">{t('settings.criticalThreshold')}</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={thresholds.inventory_critical_threshold}
                  onChange={(e) => setThresholds(prev => ({
                    ...prev,
                    inventory_critical_threshold: Number(e.target.value)
                  }))}
                />
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('settings.criticalThresholdTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.paymentReminders')}</CardTitle>
          <CardDescription>{t('settings.paymentRemindersDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-sm font-medium">{t('settings.reminderDays')}</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={thresholds.payment_reminder_days}
                  onChange={(e) => setThresholds(prev => ({
                    ...prev,
                    payment_reminder_days: Number(e.target.value)
                  }))}
                />
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('settings.reminderDaysTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleReset}>
          {t('common.reset')}
        </Button>
        <Button onClick={handleSave}>
          {t('common.save')}
        </Button>
      </div>
    </div>
  );
}
