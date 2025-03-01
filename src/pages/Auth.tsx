
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AuthForm } from "@/features/auth/components/AuthForm";
import { EmailTester } from "@/components/auth/EmailTester";
import { Card, CardContent } from "@/components/ui/card";

const Auth = () => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Verificar se o modo de diagnóstico deve ser ativado
    const params = new URLSearchParams(location.search);
    const diagnostics = params.get('diagnostics');
    
    if (diagnostics === "true") {
      setShowDiagnostics(true);
    }
  }, [location]);

  const toggleDiagnostics = () => {
    setShowDiagnostics(!showDiagnostics);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Bem-vindo
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardContent className="pt-6">
            <AuthForm />
            
            <div className="mt-6 text-center">
              <button 
                onClick={toggleDiagnostics}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {showDiagnostics ? "Ocultar Diagnósticos" : "Mostrar Diagnósticos"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {showDiagnostics && (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <EmailTester />
        </div>
      )}
    </div>
  );
};

export default Auth;
