
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface SignupFormProps {
  inviteToken?: string;
}

export const SignupForm: React.FC<SignupFormProps> = ({ inviteToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("SignupForm: Tentando cadastro para", email);
    
    // Validação básica
    if (!email || !password || !fullName) {
      toast.error("Por favor, preencha todos os campos");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });
      
      if (error) throw error;
      
      if (inviteToken) {
        console.log("SignupForm: Processando convite com token", inviteToken);
        // Atualiza o status do convite se existir um token
        await supabase.from('store_invites')
          .update({ status: 'accepted' })
          .eq('token', inviteToken);
      }
      
      toast.success("Registro realizado! Verifique seu email para confirmar a conta");
    } catch (error: any) {
      console.error("SignupForm: Erro de cadastro:", error);
      toast.error(error instanceof Error ? error.message : "Falha ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="full-name">Nome Completo</Label>
        <Input
          id="full-name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Senha</Label>
        <Input
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Processando..." : (inviteToken ? "Aceitar Convite" : "Criar Conta")}
      </Button>
    </form>
  );
};
