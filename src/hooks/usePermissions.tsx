
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Permissions {
  isManager: boolean;
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
        // Check if the user is a super admin (matches either of the admin emails)
        if (user.email === "wjc771@gmail.com" || user.email === "jotafieldsfirst@gmail.com") {
          setPermissions({
            isManager: true,
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

        // Get staff record for the user
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (staffError) {
          console.error('Error fetching staff data:', staffError);
          setPermissions(prev => ({ ...prev, loading: false }));
          return;
        }

        if (!staffData) {
          // Set default permissions for users without staff records
          setPermissions({
            isManager: false,
            permissions: {
              sales: true,
              inventory: true,
              financial: false,
              customers: true,
              staff: false,
              settings: false,
            },
            loading: false,
          });
          return;
        }

        // Get positions for the staff member
        const { data: positionsData, error: positionsError } = await supabase
          .from('staff_positions')
          .select(`
            position_id,
            positions (
              is_managerial,
              permissions
            )
          `)
          .eq('staff_id', staffData.id);

        if (positionsError) {
          console.error('Error fetching positions data:', positionsError);
          setPermissions(prev => ({ ...prev, loading: false }));
          return;
        }

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
            if (position.permissions) {
              Object.keys(position.permissions).forEach((key) => {
                if (position.permissions[key]) acc.permissions[key] = true;
              });
            }
            
            return acc;
          },
          {
            isManager: false,
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
