
import { supabase } from '@/integrations/supabase/client';
import { validateRelationships } from '../relationshipValidators';
import { ValidationResult, CustomersValidationData } from '../types';
import { z } from 'zod';

// Define a type for sales records to avoid deep type recursion
type SalesRecord = {
  amount: number;
  created_at: string;
};

export const customersValidator = async (
  data: CustomersValidationData
): Promise<ValidationResult> => {
  // Basic schema validation
  const customerSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    email: z.string().email().optional().nullable(),
    phone: z.string().optional().nullable(),
    status: z.string().optional(),
    total_purchases: z.number().optional(),
    last_purchase_date: z.string().optional().nullable(),
    store_id: z.string().uuid().optional().nullable(),
  });

  const result = customerSchema.safeParse(data);

  if (!result.success) {
    return {
      valid: false,
      errors: result.error.errors,
    };
  }

  // Validate relationships
  const relationshipErrors = await validateRelationships(data);

  if (relationshipErrors.length > 0) {
    return {
      valid: false,
      errors: relationshipErrors,
    };
  }

  // Validate business logic
  if (data.total_purchases !== undefined) {
    const { data: salesData } = await supabase
      .from('sales')
      .select('amount, created_at')
      .eq('customer_id', data.id);

    // Use the defined type to avoid deep type recursion
    const sales = salesData as SalesRecord[] || [];
    const actualTotalPurchases = sales.length;

    if (data.total_purchases !== actualTotalPurchases) {
      return {
        valid: false,
        errors: [
          {
            code: 'custom',
            message: `Total purchases should be ${actualTotalPurchases}`,
            path: ['total_purchases'],
          },
        ],
      };
    }
  }

  return {
    valid: true,
    errors: [],
  };
};
