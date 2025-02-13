
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

const BusinessControl = () => {
  const { isManager, loading } = usePermissions();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [storeId, setStoreId] = useState<string | null>(null);

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

  return (
    <SettingsProvider>
      <DashboardLayout>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">{t('business.title')}</h2>
          </div>
          
          <Tabs defaultValue="sales" className="space-y-4">
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="sales">{t('business.tabs.salesInventory')}</TabsTrigger>
              <TabsTrigger value="customers">{t('business.tabs.customersOrders')}</TabsTrigger>
              <TabsTrigger value="financial">{t('business.tabs.financial')}</TabsTrigger>
              <TabsTrigger value="team">{t('business.tabs.team')}</TabsTrigger>
              <TabsTrigger value="reconciliation">{t('business.tabs.reconciliation')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sales" className="space-y-4">
              <SalesInventoryTab />
            </TabsContent>
            
            <TabsContent value="customers" className="space-y-4">
              <CustomersOrdersTab />
            </TabsContent>
            
            <TabsContent value="financial" className="space-y-4">
              <FinancialTab />
            </TabsContent>
            
            <TabsContent value="team" className="space-y-4">
              <TeamTab />
            </TabsContent>

            <TabsContent value="reconciliation" className="space-y-4">
              {storeId && <ReconciliationManager storeId={storeId} />}
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </SettingsProvider>
  );
};

export default BusinessControl;
