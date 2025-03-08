
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

const supabaseUrl = "https://abrofualuqiznoxmzetj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFicm9mdWFsdXFpem5veG16ZXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxOTU3ODUsImV4cCI6MjA1NDc3MTc4NX0.hvVxdtVpNRUZCmPi355_TxoDp4tRZ5Cjz0g1zlutEnI";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
