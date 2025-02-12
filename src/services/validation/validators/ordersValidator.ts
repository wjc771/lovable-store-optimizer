
import { supabase } from '@/integrations/supabase/client';
import { ValidationResult, OrdersValidationData } from '../types';

export async function validateOrdersRelationships(
  data: OrdersValidationData
): Promise<ValidationResult<OrdersValidationData>> {
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
