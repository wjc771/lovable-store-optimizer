
import { supabase } from "@/lib/supabase";

/**
 * Verifies if a user is a superadmin using email check and RPC function
 */
export const checkSuperAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    console.log("AuthVerification: Checking superadmin status for", userId);
    
    // Special verification for jotafieldsfirst@gmail.com (highest priority)
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user?.email === 'jotafieldsfirst@gmail.com') {
      console.log("AuthVerification: jotafieldsfirst@gmail.com is superadmin by direct email check");
      return true;
    }
    
    // Use the simplified is_super_admin RPC function
    const { data, error } = await supabase.rpc('is_super_admin');
    
    if (error) {
      console.error("AuthVerification: Error verifying superadmin status with RPC:", error);
      return false;
    }
    
    console.log("AuthVerification: Superadmin status via RPC:", data);
    return !!data;
  } catch (error) {
    console.error("AuthVerification: Error verifying superadmin status:", error);
    return false;
  }
};

/**
 * Verifies if a user is an admin (simplified using RPC)
 */
export const checkAdminStatus = async (userId: string): Promise<boolean> => {
  try {
    console.log("AuthVerification: Checking admin status for", userId);
    
    // First check if user is a superadmin (which implies admin privileges)
    const isSuperAdmin = await checkSuperAdminStatus(userId);
    if (isSuperAdmin) {
      console.log("AuthVerification: User is superadmin, therefore also admin");
      return true;
    }
    
    // Check if email is jotafieldsfirst@gmail.com
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user?.email === 'jotafieldsfirst@gmail.com') {
      console.log("AuthVerification: jotafieldsfirst@gmail.com is admin by direct email check");
      return true;
    }
    
    // Check if user is a staff member with admin role
    const { data: isStaffMember, error: staffError } = await supabase.rpc('is_staff_member');
    
    if (staffError) {
      console.error("AuthVerification: Error checking staff status:", staffError);
      return false;
    }
    
    console.log("AuthVerification: User is staff member?", isStaffMember);
    return !!isStaffMember;
  } catch (error) {
    console.error("AuthVerification: Error checking admin status:", error);
    return false;
  }
};
