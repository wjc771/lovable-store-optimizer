
import { useState } from "react";
import type { User, Session } from "@supabase/supabase-js";

interface UserSessionState {
  user: User | null;
  session: Session | null;
}

interface UserSessionResult extends UserSessionState {
  handleUserSession: (currentSession: Session | null) => Promise<boolean>;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
}

export const useUserSession = (): UserSessionResult => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const handleUserSession = async (currentSession: Session | null): Promise<boolean> => {
    try {
      console.log("UserSession: Processing user session", currentSession?.user?.email);
      if (!currentSession?.user) {
        console.log("UserSession: No session or user found");
        setSession(null);
        setUser(null);
        return false;
      }

      setSession(currentSession);
      setUser(currentSession.user);
      return true;

    } catch (error) {
      console.error("UserSession: Error processing session:", error);
      return false;
    }
  };

  return {
    user,
    session,
    handleUserSession,
    setSession,
    setUser
  };
};
