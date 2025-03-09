import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { BusinessSettings } from "@/components/settings/BusinessSettings";
import { StaffSettings } from "@/components/settings/StaffSettings";
import { IntegrationsSettings } from "@/components/settings/IntegrationsSettings";
import { NotificationsSettings } from "@/components/settings/NotificationsSettings";
import { SmartActionsSettings } from "@/components/settings/SmartActionsSettings";
import { ProductsSettings } from "@/components/settings/ProductsSettings";
import { ReconciliationSettings } from "@/components/settings/ReconciliationSettings";
import { supabase } from "@/integrations/supabase/client";
import { StaffMember, Position } from "@/types/settings";
import { ProductWithCategory } from "@/types/products";
// Import the new PurgeUsers component
import { PurgeUsers } from "@/components/settings/PurgeUsers";
import { usePermissions } from "@/hooks/usePermissions";

const Settings = () => {
  const { t } = useTranslation();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [products, setProducts] = useState<ProductWithCategory[]>([]);

  const { isManager, permissions } = usePermissions();

  const { data: initialStaff } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const { data } = await supabase
        .from('staff')
        .select(`
          id,
          name,
          status,
          staff_positions (
            position_id,
            positions (name)
          )
        `);

      return data?.map(staff => ({
        id: staff.id,
        name: staff.name,
        status: staff.status as "active" | "inactive",
        positions: staff.staff_positions?.map(sp => sp.positions?.name) || [],
        position_ids: staff.staff_positions?.map(sp => sp.position_id) || [],
      })) || [];
    },
    onSuccess: (data) => {
      setStaffMembers(data);
    },
  });

  const { data: initialPositions } = useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      const { data } = await supabase
        .from('positions')
        .select('*');
      return data || [];
    },
    onSuccess: (data) => {
      setPositions(data);
    },
  });

  const { data: initialProducts } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select(`
          *,
          category:category_id (
            id,
            name
          ),
          product_thresholds (
            id,
            low_threshold,
            critical_threshold
          )
        `);
      return data || [];
    },
    onSuccess: (data) => {
      setProducts(data || []);
    },
  });

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h2>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">{t('settings.tabs.general')}</TabsTrigger>
          <TabsTrigger value="business">{t('settings.tabs.business')}</TabsTrigger>
          <TabsTrigger value="staff">{t('settings.tabs.staff')}</TabsTrigger>
          <TabsTrigger value="integrations">{t('settings.tabs.integrations')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('settings.tabs.notifications')}</TabsTrigger>
          <TabsTrigger value="smartActions">{t('settings.tabs.smartActions')}</TabsTrigger>
          <TabsTrigger value="products">{t('settings.tabs.products')}</TabsTrigger>
          <TabsTrigger value="reconciliation">{t('settings.tabs.reconciliation')}</TabsTrigger>
          {isManager && (
            <TabsTrigger value="admin">{t('settings.tabs.admin')}</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <GeneralSettings />
        </TabsContent>

        <TabsContent value="business" className="space-y-4">
          <BusinessSettings />
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <StaffSettings
            staffMembers={staffMembers}
            positions={positions}
            setStaffMembers={setStaffMembers}
            setPositions={setPositions}
          />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <IntegrationsSettings />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationsSettings />
        </TabsContent>

        <TabsContent value="smartActions" className="space-y-4">
          <SmartActionsSettings />
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <ProductsSettings
            products={products}
            setProducts={setProducts}
          />
        </TabsContent>

        <TabsContent value="reconciliation" className="space-y-4">
          <ReconciliationSettings />
        </TabsContent>
        
        {isManager && (
          <TabsContent value="admin" className="space-y-4">
            <PurgeUsers />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Settings;
