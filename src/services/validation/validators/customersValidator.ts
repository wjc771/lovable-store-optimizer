
import { supabase } from '@/integrations/supabase/client';
import { ValidationResult, CustomersValidationData } from '../types';
import { z } from 'zod';

interface SalesRecord {
  amount: number;
  created_at: string;
}

export async function validateCustomersRelationships(
  data: CustomersValidationData
): Promise<ValidationResult<CustomersValidationData>> {
  try {
    // Validate store relationship if store_id is present
    if (data.store_id) {
      const { data: store } = await supabase
        .from('stores')
        .select('id')
        .eq('id', data.store_id)
        .maybeSingle();

      if (!store) {
        const zodError = new z.ZodError([{
          code: z.ZodIssueCode.custom,
          path: ['store_id'],
          message: 'Store not found'
        }]);
        throw zodError;
      }
    }

    // If we have an ID, validate the sales history
    if (data.id) {
      const { data: salesData } = await supabase
        .from('sales')
        .select('amount, created_at')
        .eq('customer_id', data.id);

      const sales = (salesData || []) as SalesRecord[];
      const actualTotalPurchases = sales.length;

      // Validate total_purchases if provided
      if (data.total_purchases !== undefined && data.total_purchases !== actualTotalPurchases) {
        const zodError = new z.ZodError([{
          code: z.ZodIssueCode.custom,
          path: ['total_purchases'],
          message: 'Total purchases does not match sales history'
        }]);
        throw zodError;
      }

      // Validate last_purchase_date if provided and sales exist
      if (sales.length > 0 && data.last_purchase_date) {
        const timestamps = sales.map(s => new Date(s.created_at).getTime());
        const lastSaleDate = new Date(Math.max(...timestamps));
        const providedLastPurchaseDate = new Date(data.last_purchase_date);

        if (lastSaleDate.getTime() !== providedLastPurchaseDate.getTime()) {
          const zodError = new z.ZodError([{
            code: z.ZodIssueCode.custom,
            path: ['last_purchase_date'],
            message: 'Last purchase date does not match sales history'
          }]);
          throw zodError;
        }
      }
    }

    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data,
        errors: error
      };
    }
    return {
      success: false,
      data,
      errors: new z.ZodError([{
        code: z.ZodIssueCode.custom,
        path: [],
        message: 'Unknown validation error'
      }])
    };
  }
}
