
import { createClient } from '@supabase/supabase-js';

// Define the Supabase URL and key directly
const supabaseUrl = "https://abrofualuqiznoxmzetj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFicm9mdWFsdXFpem5veG16ZXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkxOTU3ODUsImV4cCI6MjA1NDc3MTc4NX0.hvVxdtVpNRUZCmPi355_TxoDp4tRZ5Cjz0g1zlutEnI";

// Define SITE_URL - preferably from environment variables or fallback to a default
export const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin;

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
