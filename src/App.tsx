
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import AppRoutes from "./routes";
import { AuthProvider } from "./contexts/AuthContext";
import { StoreProvider } from "./contexts/StoreContext";
import { SettingsProvider } from "./contexts/SettingsContext";

// Configure the QueryClient with better defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Add better error handling
      onError: (error) => {
        console.error("Query error:", error);
      },
    },
    mutations: {
      // Add better error handling for mutations
      onError: (error) => {
        console.error("Mutation error:", error);
      },
    }
  }
});

function App() {
  console.log("Rendering App component - Root level");
  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <StoreProvider>
              <SettingsProvider>
                <AppRoutes />
                <Toaster />
              </SettingsProvider>
            </StoreProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
