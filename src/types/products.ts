
import type { Json } from "@/integrations/supabase/types";

export interface ProductCategory {
  id: string;
  name: string;
  description?: string | null;
  store_id?: string | null;
  metadata?: Json | null;
  created_at?: string;
}

export interface CategoryThreshold {
  id: string;
  category_id: string | null;
  store_id?: string | null;
  low_threshold: number;
  critical_threshold: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductWithCategory {
  id: string;
  active: boolean;
  name: string | null;
  description?: string | null;
  price?: number | null;
  stock: number | null;
  category_id: string;
  store_id?: string | null;
  custom_low_threshold?: number | null;
  custom_critical_threshold?: number | null;
  metadata?: Json | null;
  version?: number | null;
  checksum?: string | null;
  category?: ProductCategory | null;
  threshold_id?: string | null;
  product_thresholds?: Array<{
    id: string;
    low_threshold: number;
    critical_threshold: number;
  }> | null;
}

