
import { supabase } from '@/integrations/supabase/client';
import { ValidationResult, CustomersValidationData } from '../types';

export async function validateCustomersRelationships(
  data: CustomersValidationData
): Promise<ValidationResult<CustomersValidationData>> {
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
