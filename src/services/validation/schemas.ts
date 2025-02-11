
import { z } from 'zod';

// Define schema types explicitly to avoid deep recursion
const baseSchema = {
  version: z.number().optional().default(1),
  id: z.string().uuid().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
} as const;

// Base schema for all records that support versioning
const versionedRecord = z.object(baseSchema);

// Schema definitions for each table
export const schemas = {
  sales: versionedRecord.extend({
    amount: z.number().positive(),
    quantity: z.number().int().positive(),
    product_id: z.string().uuid().optional(),
    store_id: z.string().uuid().optional(),
    status: z.enum(['pending', 'completed', 'cancelled']).default('completed'),
  }),

  customers: versionedRecord.extend({
    name: z.string().min(1),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    store_id: z.string().uuid().optional(),
    status: z.enum(['active', 'inactive']).default('active'),
    total_purchases: z.number().default(0),
    last_purchase_date: z.string().datetime().optional(),
  }),

  orders: versionedRecord.extend({
    total_amount: z.number().positive(),
    customer_id: z.string().uuid().optional(),
    store_id: z.string().uuid().optional(),
    status: z.enum(['pending', 'completed', 'cancelled']).default('pending'),
  }),

  tasks: versionedRecord.extend({
    title: z.string().min(1),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    status: z.enum(['pending', 'in_progress', 'completed']).default('pending'),
    due_date: z.string().datetime().optional(),
    staff_id: z.string().uuid().optional(),
    store_id: z.string().uuid().optional(),
  }),

  products: versionedRecord.extend({
    name: z.string().min(1),
    stock: z.number().int().min(0).default(0),
    store_id: z.string().uuid().optional(),
    metadata: z.record(z.unknown()).optional(),
  }),
} as const;

