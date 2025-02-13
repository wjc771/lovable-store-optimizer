
import { supabase } from '@/integrations/supabase/client';
import { ValidationResult, CustomersValidationData } from '../types';

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
        throw new Error('Store not found');
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
        throw new Error('Total purchases does not match sales history');
      }

      // Validate last_purchase_date if provided and sales exist
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
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        data,
        errors: new Error(error.message)
      };
    }
    return {
      success: false,
      data,
      errors: new Error('Unknown validation error')
    };
  }
}
