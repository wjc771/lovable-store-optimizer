
export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  store_id?: string;
  metadata?: Record<string, unknown>;
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
  name: string | null;
  stock: number | null;
  category_id?: string | null;
  store_id?: string | null;
  custom_low_threshold?: number | null;
  custom_critical_threshold?: number | null;
  metadata?: Record<string, unknown> | null;
  version?: number | null;
}
