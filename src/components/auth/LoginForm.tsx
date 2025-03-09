
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { signIn, resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    console.log("Attempting login with:", { email, password: "***" });

    try {
      await signIn(email, password);
      
      toast({
        title: "Sucesso",
        description: "Login realizado com sucesso",
      });
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle specific error cases with clear error messages
      if (error instanceof Error) {
        if (error.message.includes('email_not_confirmed') || error.message.includes('Email not confirmed')) {
          setError('Por favor, verifique seu email para confirmar seu cadastro antes de fazer login.');
        } else if (error.message.includes('invalid_credentials') || error.message.includes('Invalid login credentials')) {
          setError('Email ou senha incorretos. Por favor, verifique suas credenciais e tente novamente.');
        } else {
          setError(`Erro durante o login: ${error.message}`);
        }
      } else {
        setError('Ocorreu um erro durante o login. Por favor, tente novamente.');
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email) {
      setError("Por favor, informe seu email para recuperar a senha");
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword(email);
      setResetSent(true);
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha",
      });
    } catch (error) {
      console.error('Reset password error:', error);
      
      if (error instanceof Error) {
        setError(`Erro ao enviar email de recuperação: ${error.message}`);
      } else {
        setError('Ocorreu um erro ao tentar recuperar sua senha. Por favor, tente novamente.');
      }

      toast({
        title: "Erro",
        description: "Falha ao enviar email de recuperação de senha",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsResetMode(!isResetMode);
    setError(null);
    setResetSent(false);
  };

  if (isResetMode) {
    return (
      <div className="w-full max-w-md mx-auto space-y-8 animate-in">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">Recuperação de senha</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Digite seu email para receber um link de recuperação de senha
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {resetSent && (
          <Alert>
            <AlertDescription>
              Um email de recuperação foi enviado. Verifique sua caixa de entrada.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="reset-email">
              Email
            </label>
            <Input
              id="reset-email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
              disabled={isLoading || resetSent}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || resetSent}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : resetSent ? "Email enviado" : "Enviar link de recuperação"}
          </Button>

          <p className="text-sm text-center">
            <Button variant="link" className="p-0" onClick={toggleMode} disabled={isLoading}>
              Voltar para o login
            </Button>
          </p>
        </form>
      </div>
    );
  }

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
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" htmlFor="password">
              Senha
            </label>
            <Button variant="link" className="p-0 h-auto text-xs" onClick={toggleMode} disabled={isLoading}>
              Esqueceu a senha?
            </Button>
          </div>
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
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : "Entrar"}
        </Button>

        <p className="text-sm text-center text-muted-foreground">
          Não tem uma conta? Por favor, cadastre-se primeiro.
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
