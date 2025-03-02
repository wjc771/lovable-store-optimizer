
import { useState } from "react";
import type { User, Session } from "@supabase/supabase-js";

interface UserSessionState {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

interface UserSessionResult extends UserSessionState {
  handleUserSession: (currentSession: Session | null) => Promise<boolean>;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  setIsSuperAdmin: (isSuperAdmin: boolean) => void;
}

export const useUserSession = (): UserSessionResult => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const handleUserSession = async (currentSession: Session | null): Promise<boolean> => {
    try {
      console.log("UserSession: Processing user session", currentSession?.user?.email);
      if (!currentSession?.user) {
        console.log("UserSession: No session or user found");
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setIsSuperAdmin(false);
        return false;
      }

      setSession(currentSession);
      setUser(currentSession.user);

      // Fast path for superadmin check by email
      if (currentSession.user.email === 'jotafieldsfirst@gmail.com') {
        console.log("UserSession: jotafieldsfirst@gmail.com detected, setting as superadmin");
        setIsSuperAdmin(true);
        setIsAdmin(true);
        return true;
      }
      
      // For regular users, determine if they're staff/admin
      // This would be replaced with your actual logic to check user roles
      setIsAdmin(false);
      setIsSuperAdmin(false);
      return true;

    } catch (error) {
      console.error("UserSession: Error processing session:", error);
      return false;
    }
  };

  return {
    user,
    session,
    isAdmin,
    isSuperAdmin,
    handleUserSession,
    setSession,
    setUser,
    setIsAdmin,
    setIsSuperAdmin
  };
};
