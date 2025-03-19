
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  error: Error | null;
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
    error: null
  });

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user) {
        setPermissions(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        console.log("Fetching permissions for user:", user.id);
        
        // Check if the user is a super admin (matches either of the admin emails)
        if (user.email === "wjc771@gmail.com" || user.email === "jotafieldsfirst@gmail.com") {
          console.log("User is a super admin");
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
            error: null
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
          setPermissions(prev => ({ 
            ...prev, 
            loading: false,
            error: staffError instanceof Error ? staffError : new Error('Failed to fetch staff data') 
          }));
          return;
        }

        if (!staffData) {
          console.log("No staff record found for user, using default permissions");
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
            error: null
          });
          return;
        }

        console.log("Staff record found:", staffData.id);

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
          setPermissions(prev => ({ 
            ...prev, 
            loading: false,
            error: positionsError instanceof Error ? positionsError : new Error('Failed to fetch positions data')
          }));
          return;
        }

        if (!positionsData?.length) {
          console.log("No positions found for staff member");
          setPermissions(prev => ({ ...prev, loading: false }));
          return;
        }

        console.log("Positions found:", positionsData);

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

        console.log("Combined permissions:", combinedPermissions);

        setPermissions({
          ...combinedPermissions,
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Error fetching permissions:', error);
        toast.error('Failed to load user permissions');
        setPermissions(prev => ({ 
          ...prev, 
          loading: false,
          error: error instanceof Error ? error : new Error('Unknown error fetching permissions')
        }));
      }
    };

    fetchPermissions();
  }, [user]);

  return permissions;
};
