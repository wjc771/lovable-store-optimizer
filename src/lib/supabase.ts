
import { createClient } from "@supabase/supabase-js";

// Este é o URL do seu projeto Supabase e a chave anônima
const supabaseUrl = "https://abrofualuqiznoxmzetj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFicm9mdWFsdXFpem5veG16ZXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxOTU3ODUsImV4cCI6MjA1NDc3MTc4NX0.hvVxdtVpNRUZCmPi355_TxoDp4tRZ5Cjz0g1zlutEnI";

// URL do site SaaS - Usado para redirecionamentos de autenticação
const siteUrl = "https://katena.autonomme.com";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Este é o cliente Supabase que será usado por toda a aplicação
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Usamos a URL explícita do site para redirecionamentos
    redirectTo: `${siteUrl}/auth?tab=reset`,
    flowType: 'pkce',
    // Ativado para ajudar na depuração
    debug: true,
    // Autorefresh para manter a sessão ativa
    autoRefreshToken: true
  }
});

// Adiciona um ouvinte global para eventos de autenticação para debug
supabase.auth.onAuthStateChange((event, session) => {
  console.log(`Auth state changed: ${event}`, { session });
});

// Exportamos a URL do site para uso em outros componentes
export const SITE_URL = siteUrl;
