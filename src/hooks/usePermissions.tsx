
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Permissions {
  isManager: boolean;
  isSaasAdmin: boolean;
  permissions: {
    sales: boolean;
    inventory: boolean;
    financial: boolean;
    customers: boolean;
    staff: boolean;
    settings: boolean;
  };
  loading: boolean;
}

export const usePermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Permissions>({
    isManager: false,
    isSaasAdmin: false,
    permissions: {
      sales: false,
      inventory: false,
      financial: false,
      customers: false,
      staff: false,
      settings: false,
    },
    loading: true,
  });

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user) {
        setPermissions(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        // First check if user is a SAAS admin
        const { data: saasAdminData } = await supabase
          .from('system_admins')
          .select('status')
          .eq('id', user.id)
          .maybeSingle();

        const isSaasAdmin = saasAdminData?.status === 'active';

        if (isSaasAdmin) {
          setPermissions({
            isManager: true,
            isSaasAdmin: true,
            permissions: {
              sales: true,
              inventory: true,
              financial: true,
              customers: true,
              staff: true,
              settings: true,
            },
            loading: false,
          });
          return;
        }

        // If not SAAS admin, check staff permissions
        const { data: staffData } = await supabase
          .from('staff')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!staffData) {
          setPermissions(prev => ({ ...prev, loading: false }));
          return;
        }

        // Get positions for the staff member
        const { data: positionsData } = await supabase
          .from('staff_positions')
          .select(`
            position_id,
            positions (
              is_managerial,
              permissions
            )
          `)
          .eq('staff_id', staffData.id);

        if (!positionsData?.length) {
          setPermissions(prev => ({ ...prev, loading: false }));
          return;
        }

        // Combine permissions from all positions
        const combinedPermissions = positionsData.reduce(
          (acc, curr) => {
            const position = curr.positions;
            if (position.is_managerial) acc.isManager = true;
            
            // Combine permissions
            Object.keys(position.permissions).forEach((key) => {
              if (position.permissions[key]) acc.permissions[key] = true;
            });
            
            return acc;
          },
          {
            isManager: false,
            isSaasAdmin: false,
            permissions: {
              sales: false,
              inventory: false,
              financial: false,
              customers: false,
              staff: false,
              settings: false,
            },
          }
        );

        setPermissions({
          ...combinedPermissions,
          loading: false,
        });

      } catch (error) {
        console.error('Error fetching permissions:', error);
        setPermissions(prev => ({ ...prev, loading: false }));
      }
    };

    fetchPermissions();
  }, [user]);

  return permissions;
};
