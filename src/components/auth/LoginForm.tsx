
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log("Attempting login with:", { email, password: "***" });

    try {
      // Try direct login via Supabase to get detailed error info
      const { error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (supabaseError) {
        console.error("Supabase login error:", supabaseError);
        throw supabaseError;
      }

      toast({
        title: "Success",
        description: "Successfully logged in",
      });
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific error cases with clear error messages
      if (error instanceof Error) {
        if (error.message.includes('invalid_credentials')) {
          setError('Email ou senha inválidos. Por favor, verifique suas credenciais e tente novamente.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Por favor, verifique seu email antes de fazer login.');
        } else {
          setError(`Erro durante o login: ${error.message}`);
        }
      } else {
        setError('Ocorreu um erro inesperado. Por favor, tente novamente.');
      }

      toast({
        title: "Erro",
        description: "Falha no login. Verifique suas credenciais.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8 animate-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">Bem-vindo(a) de volta</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Digite suas credenciais para acessar sua conta
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="password">
            Senha
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
            disabled={isLoading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Não tem uma conta? Por favor, cadastre-se primeiro.
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
