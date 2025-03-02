
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

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

// Updated interface to match the actual structure returned by Supabase
interface StaffPositionData {
  position_id: string;
  positions: {
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
      console.log("usePermissions: Fetching permissions for user:", user?.id);
      if (!user) {
        setPermissions(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        // Check if they're a staff member with permissions
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (staffError) {
          console.error("usePermissions: Error fetching staff data:", staffError);
        }

        if (!staffData) {
          console.log("usePermissions: User is not a staff member");
          setPermissions(prev => ({ ...prev, loading: false }));
          return;
        }

        console.log("usePermissions: User is a staff member with ID:", staffData.id);

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
          console.error("usePermissions: Error fetching positions:", positionsError);
        }

        if (!positionsData?.length) {
          console.log("usePermissions: No positions found for staff member");
          setPermissions(prev => ({ ...prev, loading: false }));
          return;
        }

        console.log("usePermissions: Found positions:", positionsData);

        // Initialize our combined permissions object
        const initialPermissions: Permissions = {
          isManager: false,
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

        // Type assertion to handle the data structure correctly
        const typedPositionsData = positionsData as unknown as StaffPositionData[];
        
        // Combine permissions from all positions
        const combinedPermissions = typedPositionsData.reduce<Permissions>(
          (acc: Permissions, curr: StaffPositionData) => {
            // Access the positions object from the current staff position
            const position = curr.positions;
            
            // Check if position exists and has is_managerial property
            if (position && position.is_managerial) {
              acc.isManager = true;
            }
            
            // Combine permissions if position and permissions exist
            if (position && position.permissions) {
              // Get all keys from the permissions object
              const permKeys = Object.keys(position.permissions);
              
              permKeys.forEach((key) => {
                // We need to type assert the keys to access properties dynamically
                const permKey = key as keyof typeof position.permissions;
                const accKey = key as keyof typeof acc.permissions;
                
                // Only set to true if the permission exists and is true
                if (position.permissions && position.permissions[permKey]) {
                  acc.permissions[accKey] = true;
                }
              });
            }
            
            return acc;
          },
          initialPermissions
        );

        console.log("usePermissions: Calculated permissions:", combinedPermissions);
        setPermissions(combinedPermissions);

      } catch (error) {
        console.error('Error fetching permissions:', error);
        setPermissions(prev => ({ ...prev, loading: false }));
      }
    };

    fetchPermissions();
  }, [user]);

  return permissions;
};
