
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Componente simples de página inicial para começar
const HomePage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Bem-vindo ao Sistema
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Aplicação simplificada para resolver problemas de navegação
          </p>
        </div>
        
        <div className="space-y-4 bg-card rounded-lg border p-6 shadow-sm">
          <button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded"
            onClick={() => toast.success("Navegação funcionando!")}
          >
            Testar Toast
          </button>
          
          <a 
            href="/segunda-pagina" 
            className="block w-full text-center bg-secondary text-secondary-foreground hover:bg-secondary/90 py-2 px-4 rounded"
          >
            Ir para Segunda Página (Link HTML)
          </a>
          
          <a 
            className="block w-full text-center bg-accent text-accent-foreground hover:bg-accent/90 py-2 px-4 rounded"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = "/segunda-pagina";
              toast.info("Redirecionando...");
            }}
          >
            Ir para Segunda Página (JavaScript Redirect)
          </a>
        </div>
      </div>
    </div>
  );
};

// Componente simples para a segunda página
const SecondPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Segunda Página
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Navegação simples está funcionando!
          </p>
        </div>
        
        <div className="space-y-4 bg-card rounded-lg border p-6 shadow-sm">
          <a 
            href="/" 
            className="block w-full text-center bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded"
          >
            Voltar para Página Inicial
          </a>
        </div>
      </div>
    </div>
  );
};

// Componente de página não encontrada
const NotFound = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
    <h1 className="text-3xl font-bold">Página não encontrada</h1>
    <a href="/" className="mt-4 text-primary hover:underline">
      Voltar para a página inicial
    </a>
  </div>
);

// Componente principal de rotas simplificado
const AppRoutes = () => {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Simular um tempo de inicialização para verificar o loading
    const timer = setTimeout(() => {
      console.log("AppRoutes: Aplicação está pronta");
      setIsReady(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Exibir um indicador de carregamento simples
  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <Routes>
      {/* Rota inicial */}
      <Route path="/" element={<HomePage />} />
      
      {/* Segunda página */}
      <Route path="/segunda-pagina" element={<SecondPage />} />
      
      {/* Rota 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
