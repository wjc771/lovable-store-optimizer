
import { useState } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { checkSuperAdminStatus, checkAdminStatus } from "@/services/auth/authVerification";

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
      console.log("UserSession: Processando sessão de usuário", currentSession?.user?.email);
      if (!currentSession?.user) {
        console.log("UserSession: Nenhuma sessão ou usuário encontrado");
        setSession(null);
        setUser(null);
        setIsAdmin(false);
        setIsSuperAdmin(false);
        return false;
      }

      setSession(currentSession);
      setUser(currentSession.user);

      console.log("UserSession: Verificando papéis do usuário");
      
      // Priority check for jotafieldsfirst@gmail.com
      if (currentSession.user.email === 'jotafieldsfirst@gmail.com') {
        console.log("UserSession: jotafieldsfirst@gmail.com identificado, definindo como superadmin");
        setIsSuperAdmin(true);
        setIsAdmin(true);
        return true;
      }
      
      // For other users, check using the updated functions that use RPC
      const superAdminStatus = await checkSuperAdminStatus(currentSession.user.id);
      if (superAdminStatus) {
        console.log("UserSession: Usuário é superadmin");
        setIsSuperAdmin(true);
        setIsAdmin(true);
        return true;
      }

      const adminStatus = await checkAdminStatus(currentSession.user.id);
      console.log("UserSession: Usuário é admin?", adminStatus);
      setIsAdmin(adminStatus);
      return true;

    } catch (error) {
      console.error("UserSession: Erro no processamento da sessão:", error);
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
