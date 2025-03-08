
import { supabase } from '@/integrations/supabase/client';
import { validateSalesRelationships } from './salesValidator';
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
      success: false,
      errors: result.error, // Use the full Zod error
      data: undefined
    };
  }

  // Validate relationships
  // For now, we'll assume only simple validation on sales relationship
  const relationshipErrors = await validateSalesRelationships(data);

  if (relationshipErrors) {
    return {
      success: false,
      errors: relationshipErrors,
      data: undefined
    };
  }

  // Validate business logic
  if (data.total_purchases !== undefined) {
    // Use explicit typing to avoid deep recursion
    const { data: salesData, error: salesError } = await supabase
      .from('sales')
      .select('amount, created_at')
      .eq('customer_id', data.id);

    if (salesError) {
      return {
        success: false,
        errors: new z.ZodError([{
          code: 'custom',
          message: `Database error: ${salesError.message}`,
          path: ['database']
        }]),
        data: undefined
      };
    }

    // Use the defined type to avoid deep type recursion
    const sales = salesData as SalesRecord[] || [];
    const actualTotalPurchases = sales.length;

    if (data.total_purchases !== actualTotalPurchases) {
      return {
        success: false,
        errors: new z.ZodError([{
          code: 'custom',
          message: `Total purchases should be ${actualTotalPurchases}`,
          path: ['total_purchases']
        }]),
        data: undefined
      };
    }
  }

  return {
    success: true,
    errors: undefined,
    data: result.data
  };
};
