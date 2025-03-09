
import React from "react";
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
import { PurgeUsers } from "@/components/settings/PurgeUsers";
import { usePermissions } from "@/hooks/usePermissions";
import { Position, StaffMember } from "@/types/settings";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Json } from "@/integrations/supabase/types";

const Settings = () => {
  const { t } = useTranslation();
  const { isManager } = usePermissions();

  const { data: staffMembers = [] } = useQuery({
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

  const { data: positions = [] } = useQuery({
    queryKey: ['positions'],
    queryFn: async () => {
      const { data } = await supabase
        .from('positions')
        .select('*');
      
      return data?.map(position => {
        // Create a properly typed permissions object by safely handling Json type
        const permissionsObj = typeof position.permissions === 'object' && position.permissions 
          ? position.permissions 
          : {};
        
        const typedPermissions = {
          sales: !!permissionsObj.sales,
          inventory: !!permissionsObj.inventory,
          financial: !!permissionsObj.financial,
          customers: !!permissionsObj.customers,
          staff: !!permissionsObj.staff,
          settings: !!permissionsObj.settings
        };

        return {
          id: position.id,
          name: position.name || '',
          is_managerial: position.is_managerial || false,
          permissions: typedPermissions
        } as Position;
      }) || [];
    },
  });

  const { data: products = [] } = useQuery({
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

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">{t('settings.settings')}</h2>
        </div>
        
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="general">{t('settings.general')}</TabsTrigger>
            <TabsTrigger value="business">{t('settings.business')}</TabsTrigger>
            <TabsTrigger value="staff">{t('settings.staff')}</TabsTrigger>
            <TabsTrigger value="integrations">{t('settings.integrations')}</TabsTrigger>
            <TabsTrigger value="notifications">{t('settings.notifications')}</TabsTrigger>
            <TabsTrigger value="smartActions">{t('settings.smartActions')}</TabsTrigger>
            <TabsTrigger value="products">{t('products.products')}</TabsTrigger>
            <TabsTrigger value="reconciliation">{t('settings.reconciliation.title')}</TabsTrigger>
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
              setStaffMembers={() => {}}
              setPositions={() => {}}
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
    </DashboardLayout>
  );
};

export default Settings;
