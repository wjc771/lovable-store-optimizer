
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { supabase } from "@/lib/db/supabase";

export const AuthForm = () => {
  console.log("AuthForm: Inicializando componente");
  const [activeTab, setActiveTab] = useState("signin");
  const [inviteToken, setInviteToken] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkForAuthFlows = async () => {
      // Log full URL to help with debugging
      console.log("AuthForm: URL completa:", window.location.href);

      // Check URL parameters
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const tab = params.get('tab');
      const type = params.get('type');
      
      console.log("AuthForm: Parâmetros URL:", { token, tab, type });
      
      // Check for invite token
      if (token) {
        console.log("AuthForm: Token de convite encontrado:", token);
        setInviteToken(token);
        setActiveTab('signup');
      }
      
      // Handle password reset flow
      if (tab === 'reset' || type === 'recovery') {
        console.log("AuthForm: Configurando fluxo de redefinição de senha a partir dos parâmetros URL");
        setIsResettingPassword(true);
        
        // Look for access token in various places
        const accessToken = params.get('access_token');
        if (accessToken) {
          console.log("AuthForm: Token de acesso encontrado nos parâmetros URL");
          setResetToken(accessToken);
        }
      }
      
      // Handle recovery flow from URL hash
      if (window.location.hash) {
        console.log("AuthForm: Hash encontrado na URL:", window.location.hash);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const tokenType = hashParams.get('type');
        
        console.log("AuthForm: Parâmetros hash:", { accessToken, tokenType });
        
        if (accessToken && (tokenType === 'recovery' || tokenType === 'passwordReset')) {
          console.log("AuthForm: Configurando atualização de senha a partir do hash com token");
          setIsResettingPassword(true);
          setResetToken(accessToken);
        }
      }
      
      // Additional check for recovery flow using getSession
      if (window.location.hash) {
        try {
          console.log("AuthForm: Tentando obter sessão para verificar token de redefinição");
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error("AuthForm: Erro ao obter sessão:", sessionError);
          } else if (sessionData.session) {
            console.log("AuthForm: Sessão obtida com sucesso!");
            setIsResettingPassword(true);
            setResetToken(sessionData.session.access_token);
          }
        } catch (err) {
          console.error("AuthForm: Exceção ao analisar hash:", err);
        }
      }
    };
    
    checkForAuthFlows();
  }, [location]);

  const handlePasswordResetSuccess = () => {
    console.log("AuthForm: Redefinição de senha concluída com sucesso");
    setIsResettingPassword(false);
    setActiveTab("signin");
  };

  if (isResettingPassword) {
    console.log("AuthForm: Renderizando formulário de redefinição de senha");
    return (
      <div className="w-full max-w-md mx-auto">
        <h2 className="text-center text-2xl font-bold mb-6">Redefinir Senha</h2>
        <ResetPasswordForm 
          accessToken={resetToken} 
          onSuccess={handlePasswordResetSuccess} 
        />
      </div>
    );
  }

  console.log("AuthForm: Renderizando formulário principal de autenticação, tab:", activeTab);
  return (
    <Tabs 
      defaultValue={inviteToken ? "signup" : "signin"} 
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger 
          value="signin"
          disabled={!!inviteToken}
        >
          Login
        </TabsTrigger>
        <TabsTrigger value="signup">
          {inviteToken ? "Aceitar Convite" : "Cadastrar"}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="signin">
        <LoginForm />
      </TabsContent>

      <TabsContent value="signup">
        <SignupForm inviteToken={inviteToken} />
      </TabsContent>
    </Tabs>
  );
};
