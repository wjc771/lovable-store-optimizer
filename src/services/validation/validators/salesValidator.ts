
import { supabase } from '@/integrations/supabase/client';
import { ValidationResult, SalesValidationData } from '../types';

export async function validateSalesRelationships(
  data: SalesValidationData
): Promise<ValidationResult<SalesValidationData>> {
  if (data.product_id) {
    const { data: product } = await supabase
      .from('products')
      .select('stock, name')
      .eq('id', data.product_id)
      .maybeSingle();

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < (data.quantity || 0)) {
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
