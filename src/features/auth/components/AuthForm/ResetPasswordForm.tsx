
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface ResetPasswordFormProps {
  accessToken?: string;
  onSuccess?: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ 
  accessToken,
  onSuccess 
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("ResetPasswordForm: Atualizando senha", accessToken ? "com token" : "sem token");

    if (newPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    try {
      // Se temos um token de acesso, usamos para definir a sessão primeiro
      if (accessToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: "", // Não temos refresh token neste caso
        });
        
        if (sessionError) {
          console.error("ResetPasswordForm: Erro ao definir sessão:", sessionError);
          throw sessionError;
        }
        
        console.log("ResetPasswordForm: Sessão definida com sucesso usando token");
      }
      
      // Agora atualizamos a senha usando a sessão atual
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) throw error;

      toast.success("Sua senha foi atualizada com sucesso");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("ResetPasswordForm: Erro na atualização de senha:", error);
      toast.error(error instanceof Error ? error.message : "Falha ao atualizar senha");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleUpdatePassword} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="new-password">Nova Senha</Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full"
          placeholder="Digite sua nova senha"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmar Senha</Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full"
          placeholder="Confirme sua nova senha"
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Atualizando..." : "Atualizar Senha"}
      </Button>
    </form>
  );
};
