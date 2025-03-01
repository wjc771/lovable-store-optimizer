
import { createClient } from "@supabase/supabase-js";

// Configuração do Supabase (URL e chave anônima)
const supabaseUrl = "https://abrofualuqiznoxmzetj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFicm9mdWFsdXFpem5veG16ZXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxOTU3ODUsImV4cCI6MjA1NDc3MTc4NX0.hvVxdtVpNRUZCmPi355_TxoDp4tRZ5Cjz0g1zlutEnI";

// URL de redirecionamento para autenticação
// Obtém a URL atual do navegador para desenvolvimento ou usa um valor fixo para produção
const siteUrl = typeof window !== 'undefined' 
  ? `${window.location.protocol}//${window.location.host}`
  : "https://katena.autonomme.com";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

console.log("Supabase: Inicializando cliente com URL:", supabaseUrl);
console.log("Supabase: Site URL configurado para:", siteUrl);

// Cliente Supabase para autenticação com debug ativado
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    // Debug para identificar problemas de autenticação
    debug: true,
    // Autorefresh para manter a sessão ativa
    autoRefreshToken: true,
    // Configurando URL de redirecionamento
    storageKey: 'supabase.auth.token',
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Adiciona um ouvinte global para eventos de autenticação com mais detalhes
supabase.auth.onAuthStateChange((event, session) => {
  console.log(`Supabase: Estado de autenticação alterado: ${event}`, {
    session: session ? {
      user: session.user?.email,
      expires_at: session.expires_at,
      provider: session.user?.app_metadata.provider
    } : null
  });
});

// Exportamos a URL do site para uso em outros componentes
export const SITE_URL = siteUrl;
