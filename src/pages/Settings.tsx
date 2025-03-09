
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { BusinessSettings } from "@/components/settings/BusinessSettings";
import { StaffSettings } from "@/components/settings/StaffSettings";
import { IntegrationSettings } from "@/components/settings/IntegrationSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { SmartActionsSettings } from "@/components/settings/SmartActionsSettings";
import ProductsSettings from "@/components/settings/ProductsSettings";
import { BusinessReconciliationSettings as ReconciliationSettings } from "@/components/settings/BusinessReconciliationSettings";
import { supabase } from "@/integrations/supabase/client";
// Import the new PurgeUsers component
import { PurgeUsers } from "@/components/settings/PurgeUsers";
import { usePermissions } from "@/hooks/usePermissions";
import { ProductWithCategory } from "@/types/products";

const Settings = () => {
  const { t } = useTranslation();
  const [staffMembers, setStaffMembers] = useState([]);
  const [positions, setPositions] = useState([]);
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
  });

  // Use effect to update the state when data is fetched
  useEffect(() => {
    if (initialStaff) {
      setStaffMembers(initialStaff);
    }
  }, [initialStaff]);

  const { data: initialPositions } = useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      const { data } = await supabase
        .from('positions')
        .select('*');
      return data || [];
    },
  });

  // Use effect to update the state when data is fetched
  useEffect(() => {
    if (initialPositions) {
      setPositions(initialPositions);
    }
  }, [initialPositions]);

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
  });

  // Use effect to update the state when data is fetched
  useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts as ProductWithCategory[]);
    }
  }, [initialProducts]);

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
          <IntegrationSettings 
            uploadWebhookUrl=""
            chatWebhookUrl=""
            onUploadWebhookUrlChange={() => {}}
            onChatWebhookUrlChange={() => {}}
            onSave={() => {}}
          />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="smartActions" className="space-y-4">
          <SmartActionsSettings />
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <ProductsSettings />
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
