
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SalesInventoryTab from "@/components/business-control/SalesInventoryTab";
import CustomersOrdersTab from "@/components/business-control/CustomersOrdersTab";
import FinancialTab from "@/components/business-control/FinancialTab";
import TeamTab from "@/components/business-control/TeamTab";
import { usePermissions } from "@/hooks/usePermissions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";
import { SettingsProvider } from "@/contexts/SettingsContext";
import ReconciliationManager from "@/components/reconciliation/ReconciliationManager";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { BarChart3, Users, DollarSign, Users2, FileCheck2 } from "lucide-react";

const BusinessControl = () => {
  const { isManager, loading } = usePermissions();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [storeId, setStoreId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchStoreId = async () => {
      if (!user) return;

      const { data: staff } = await supabase
        .from('staff')
        .select('store_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (staff?.store_id) {
        setStoreId(staff.store_id);
      }
    };

    fetchStoreId();
  }, [user]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">{t('common.loading')}</div>;
  }

  if (!isManager) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <Alert variant="destructive">
            <AlertDescription>
              {t('dashboard.permissions.noAccess')}
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  const tabItems = [
    {
      value: "sales",
      label: t('business.tabs.salesInventory'),
      icon: <BarChart3 className="h-4 w-4" />,
      content: <SalesInventoryTab />
    },
    {
      value: "customers",
      label: t('business.tabs.customersOrders'),
      icon: <Users className="h-4 w-4" />,
      content: <CustomersOrdersTab />
    },
    {
      value: "financial",
      label: t('business.tabs.financial'),
      icon: <DollarSign className="h-4 w-4" />,
      content: <FinancialTab />
    },
    {
      value: "team",
      label: t('business.tabs.team'),
      icon: <Users2 className="h-4 w-4" />,
      content: <TeamTab />
    },
    {
      value: "reconciliation",
      label: t('business.tabs.reconciliation'),
      icon: <FileCheck2 className="h-4 w-4" />,
      content: storeId ? <ReconciliationManager storeId={storeId} /> : null
    }
  ];

  return (
    <SettingsProvider>
      <DashboardLayout>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">{t('business.title')}</h2>
          </div>
          
          <Tabs defaultValue="sales" className="space-y-4">
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="inline-flex w-full md:w-auto">
                {tabItems.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="min-w-24 flex items-center gap-2 px-4"
                  >
                    {tab.icon}
                    {!isMobile && <span>{tab.label}</span>}
                  </TabsTrigger>
                ))}
              </TabsList>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            
            {tabItems.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="space-y-4">
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DashboardLayout>
    </SettingsProvider>
  );
};

export default BusinessControl;
