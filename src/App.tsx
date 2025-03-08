
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import AppRoutes from "./routes";

// Configure o queryClient com opções adequadas para v5
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// Substitua o console.error padrão para lidar com erros do React Query
const originalConsoleError = console.error;
console.error = (...args) => {
  // Filtrar erros internos do React Query que não são relevantes para o usuário
  if (typeof args[0] === 'string' && 
     (args[0].includes('QueryClient') || args[0].includes('Hydration'))) {
    console.log('React Query internal error:', args[0]);
    return;
  }
  originalConsoleError(...args);
};

function App() {
  console.log("App: Renderizando aplicação");
  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppRoutes />
          <Toaster position="top-right" />
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
