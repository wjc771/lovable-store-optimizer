
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { authService } from "@/services/auth/auth.service";
import { SITE_URL } from "@/lib/db/supabase";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("LoginForm: Tentando login com", email);
    
    try {
      await authService.signIn(email, password);
      toast.success("Login realizado com sucesso");
    } catch (error: any) {
      console.error("LoginForm: Erro de login:", error);
      toast.error(error instanceof Error ? error.message : "Falha ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("LoginForm: Tentando redefinir senha para", email);
    
    try {
      await authService.resetPassword(email);
      toast.success("Instruções para redefinição de senha enviadas para seu email");
      setIsResetting(false);
    } catch (error: any) {
      console.error("LoginForm: Erro na redefinição de senha:", error);
      toast.error(error instanceof Error ? error.message : "Falha ao redefinir senha");
    } finally {
      setIsLoading(false);
    }
  };

  if (isResetting) {
    return (
      <form onSubmit={handleResetPassword} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="reset-email">Email</Label>
          <Input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar Instruções"}
        </Button>
        <p className="text-center text-sm">
          <button
            type="button"
            onClick={() => setIsResetting(false)}
            className="text-primary hover:underline"
          >
            Voltar ao Login
          </button>
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Senha</Label>
          <button
            type="button"
            onClick={() => setIsResetting(true)}
            className="text-sm text-primary hover:underline"
          >
            Esqueceu a senha?
          </button>
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Logando..." : "Login"}
      </Button>
    </form>
  );
};
