
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
      gcTime: 10 * 60 * 1000, // 10 minutes (cacheTime renamed to gcTime in v5)
    },
  },
});

// Set up custom logging for React Query
console.error = (...args) => {
  const [first, ...rest] = args;
  if (typeof first === 'string' && first.includes('Query error')) {
    console.warn('Query error:', ...rest);
  } else {
    console.warn(...args);
  }
};

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
