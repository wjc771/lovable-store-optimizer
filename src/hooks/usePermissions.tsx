
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

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

// Define an interface for the position data structure we're working with
interface PositionData {
  position_id: string;
  positions?: {
    is_managerial?: boolean;
    permissions?: {
      sales?: boolean;
      inventory?: boolean;
      financial?: boolean;
      customers?: boolean;
      staff?: boolean;
      settings?: boolean;
    };
  };
}

export const usePermissions = () => {
  const { user, isSuperAdmin: authIsSuperAdmin } = useAuth();
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
        // Use the superadmin status directly from AuthContext
        // This ensures consistency across the application
        if (authIsSuperAdmin) {
          console.log("usePermissions: Usuário é superadmin via AuthContext");
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

        // If not a superadmin via AuthContext, check if they're a staff member with permissions
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

        // Initialize our combined permissions object
        const initialPermissions: Permissions = {
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
          loading: false
        };

        // Combine permissions from all positions
        const combinedPermissions = positionsData.reduce<Permissions>(
          (acc, curr) => {
            // Make sure positions exists before accessing its properties
            const position = curr.positions;
            
            // Check if position exists and has is_managerial property
            if (position && position.is_managerial) {
              acc.isManager = true;
            }
            
            // Combine permissions if position and permissions exist
            if (position && position.permissions) {
              const permKeys = Object.keys(position.permissions);
              
              permKeys.forEach((key) => {
                // Safe type assertion for accessing dynamic properties
                const permKey = key as keyof typeof position.permissions;
                const accKey = key as keyof typeof acc.permissions;
                
                if (position.permissions && position.permissions[permKey]) {
                  acc.permissions[accKey] = true;
                }
              });
            }
            
            return acc;
          },
          initialPermissions
        );

        setPermissions(combinedPermissions);

      } catch (error) {
        console.error('Error fetching permissions:', error);
        setPermissions(prev => ({ ...prev, loading: false }));
      }
    };

    fetchPermissions();
  }, [user, authIsSuperAdmin]);

  return permissions;
};
