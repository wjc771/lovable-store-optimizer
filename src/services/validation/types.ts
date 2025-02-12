
import { z } from 'zod';

export type ValidationResult<T = unknown> = {
  success: boolean;
  errors?: z.ZodError;
  data?: T;
};

// Export TableNames type
export type TableNames = 'sales' | 'customers' | 'orders' | 'tasks' | 'products';

// Base types for validation
export interface BaseValidationData {
  store_id?: string;
  version?: number;
  created_at?: string;
  updated_at?: string;
  checksum?: string;
}

export interface SalesValidationData extends BaseValidationData {
  product_id?: string;
  quantity?: number;
  amount?: number;
  status?: 'pending' | 'completed' | 'cancelled';
}

export interface OrdersValidationData extends BaseValidationData {
  customer_id?: string;
  total_amount?: number;
  status?: 'pending' | 'completed' | 'cancelled';
}

export interface TasksValidationData extends BaseValidationData {
  staff_id?: string;
  due_date?: string;
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'completed';
}

export interface ProductsValidationData extends BaseValidationData {
  id?: string;
  stock?: number;
  name?: string;
  metadata?: Record<string, unknown>;
}

export interface CustomersValidationData extends BaseValidationData {
  id?: string;
  total_purchases?: number;
  last_purchase_date?: string;
  name?: string;
  email?: string;
  phone?: string;
  status?: 'active' | 'inactive';
}
