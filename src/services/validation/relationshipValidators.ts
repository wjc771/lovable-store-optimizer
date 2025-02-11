import { supabase } from '@/integrations/supabase/client';
import { ValidationResult } from './types';
import type { Database } from '@/integrations/supabase/types';

// Remove unused import
// import { z } from 'zod';

export async function validateSalesRelationships(data: any): Promise<ValidationResult> {
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

export async function validateOrdersRelationships(data: any): Promise<ValidationResult> {
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

export async function validateTasksRelationships(data: any): Promise<ValidationResult> {
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

export async function validateProductsRelationships(data: any): Promise<ValidationResult> {
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

export async function validateCustomersRelationships(data: any): Promise<ValidationResult> {
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
    const { data: salesData } = await supabase
      .from('sales')
      .select('amount, created_at')
      .eq('customer_id', data.id);

    const sales = salesData || [];
    const actualTotalPurchases = sales.length;

    if (data.total_purchases !== undefined && data.total_purchases !== actualTotalPurchases) {
      throw new Error('Total purchases does not match sales history');
    }

    if (sales.length > 0 && data.last_purchase_date) {
      const timestamps = sales.map(s => new Date(s.created_at).getTime());
      const lastSaleDate = new Date(Math.max(...timestamps));
      const providedLastPurchaseDate = new Date(data.last_purchase_date);

      if (lastSaleDate.getTime() !== providedLastPurchaseDate.getTime()) {
        throw new Error('Last purchase date does not match sales history');
      }
    }
  }

  return { success: true, data };
}
