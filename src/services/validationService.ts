
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

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

export type ValidationResult = {
  success: boolean;
  errors?: z.ZodError;
  data?: any;
};

// Type helper to get table names using keyof
export type TableNames = keyof typeof schemas;

export class ValidationService {
  validateRecord(tableName: TableNames, data: any): ValidationResult {
    const schema = schemas[tableName];
    if (!schema) {
      return {
        success: false,
        errors: new z.ZodError([{
          code: z.ZodIssueCode.custom,
          path: [],
          message: `No validation schema found for table: ${tableName}`
        }])
      };
    }

    try {
      const validatedData = schema.parse(data);
      return {
        success: true,
        data: validatedData
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error
        };
      }
      throw error;
    }
  }

  async validateRelationships(tableName: TableNames, data: any): Promise<ValidationResult> {
    try {
      switch (tableName) {
        case 'sales':
          return await this.validateSalesRelationships(data);
        case 'orders':
          return await this.validateOrdersRelationships(data);
        case 'tasks':
          return await this.validateTasksRelationships(data);
        case 'products':
          return await this.validateProductsRelationships(data);
        case 'customers':
          return await this.validateCustomersRelationships(data);
        default:
          return { success: true, data };
      }
    } catch (error) {
      return {
        success: false,
        errors: new z.ZodError([{
          code: z.ZodIssueCode.custom,
          path: [],
          message: error instanceof Error ? error.message : 'Unknown validation error'
        }])
      };
    }
  }

  private async validateSalesRelationships(data: any): Promise<ValidationResult> {
    if (data.product_id) {
      const { data: product } = await supabase
        .from('products')
        .select('stock, name')
        .eq('id', data.product_id)
        .maybeSingle();

      if (!product) {
        throw new Error('Product not found');
      }

      if (product.stock < data.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }
    }

    if (data.store_id) {
      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('id', data.store_id)
        .maybeSingle();

      if (!store) {
        throw new Error('Store not found');
      }
    }

    return { success: true, data };
  }

  private async validateOrdersRelationships(data: any): Promise<ValidationResult> {
    if (data.customer_id) {
      const { data: customer } = await supabase
        .from('customers')
        .select('status, name')
        .eq('id', data.customer_id)
        .maybeSingle();

      if (!customer) {
        throw new Error('Customer not found');
      }

      if (customer.status === 'inactive') {
        throw new Error(`Customer ${customer.name} is inactive`);
      }
    }

    if (data.store_id) {
      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('id', data.store_id)
        .maybeSingle();

      if (!store) {
        throw new Error('Store not found');
      }
    }

    return { success: true, data };
  }

  private async validateTasksRelationships(data: any): Promise<ValidationResult> {
    if (data.staff_id) {
      const { data: staff } = await supabase
        .from('staff')
        .select('status, name')
        .eq('id', data.staff_id)
        .maybeSingle();

      if (!staff) {
        throw new Error('Staff member not found');
      }

      if (staff.status === 'inactive') {
        throw new Error(`Staff member ${staff.name} is inactive`);
      }
    }

    if (data.store_id) {
      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('id', data.store_id)
        .maybeSingle();

      if (!store) {
        throw new Error('Store not found');
      }
    }

    if (data.due_date && new Date(data.due_date) < new Date()) {
      throw new Error('Due date cannot be in the past');
    }

    return { success: true, data };
  }

  private async validateProductsRelationships(data: any): Promise<ValidationResult> {
    if (data.store_id) {
      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('id', data.store_id)
        .maybeSingle();

      if (!store) {
        throw new Error('Store not found');
      }
    }

    if (data.id && data.stock !== undefined) {
      const { data: pendingSales } = await supabase
        .from('sales')
        .select('quantity')
        .eq('product_id', data.id)
        .eq('status', 'pending');

      const totalPendingQuantity = (pendingSales || []).reduce((sum, sale) => sum + sale.quantity, 0);
      
      if (data.stock - totalPendingQuantity < 0) {
        throw new Error('Stock cannot be less than pending sales');
      }
    }

    return { success: true, data };
  }

  private async validateCustomersRelationships(data: any): Promise<ValidationResult> {
    if (data.store_id) {
      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('id', data.store_id)
        .maybeSingle();

      if (!store) {
        throw new Error('Store not found');
      }
    }

    if (data.id) {
      interface SaleRecord {
        amount: number;
        created_at: string;
      }

      const { data: sales } = await supabase
        .from('sales')
        .select('amount, created_at')
        .eq('customer_id', data.id);

      const actualTotalPurchases = (sales || []).length;

      if (data.total_purchases !== undefined && data.total_purchases !== actualTotalPurchases) {
        throw new Error('Total purchases does not match sales history');
      }

      if (sales && sales.length > 0 && data.last_purchase_date) {
        const typedSales = sales as SaleRecord[];
        const lastSaleDate = new Date(Math.max(...typedSales.map(s => new Date(s.created_at).getTime())));
        const providedLastPurchaseDate = new Date(data.last_purchase_date);

        if (lastSaleDate.getTime() !== providedLastPurchaseDate.getTime()) {
          throw new Error('Last purchase date does not match sales history');
        }
      }
    }

    return { success: true, data };
  }

  validateDataIntegrity(tableName: TableNames, data: any): ValidationResult {
    return { success: true, data };
  }
}

export const validationService = new ValidationService();
