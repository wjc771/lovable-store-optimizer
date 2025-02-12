
import { supabase } from '@/integrations/supabase/client';
import { ValidationResult, ProductsValidationData } from '../types';

export async function validateProductsRelationships(
  data: ProductsValidationData
): Promise<ValidationResult<ProductsValidationData>> {
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

    const totalPendingQuantity = (pendingSales || []).reduce(
      (sum: number, sale: { quantity: number }) => sum + sale.quantity,
      0
    );
    
    if (data.stock - totalPendingQuantity < 0) {
      throw new Error('Stock cannot be less than pending sales');
    }
  }

  return { success: true, data };
}
