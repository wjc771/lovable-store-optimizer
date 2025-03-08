
import { supabase } from '@/integrations/supabase/client';
import { ValidationResult, CustomersValidationData } from '../types';
import { z } from 'zod';

// Define a simple interface for sales records to avoid deep type recursion
interface SalesRecord {
  amount: number;
  created_at: string;
}

// Helper function to validate sales relationships for a customer
const validateCustomerSalesRelationships = async (data: CustomersValidationData): Promise<z.ZodError | undefined> => {
  if (!data.id) return undefined;
  
  // Basic validation logic for sales related to this customer
  const { error } = await supabase
    .from('sales')
    .select('id')
    .eq('customer_id', data.id)
    .limit(1);
    
  if (error) {
    return new z.ZodError([{
      code: z.ZodIssueCode.custom,
      message: `Error validating sales relationships: ${error.message}`,
      path: ['sales_relationships']
    }]);
  }
  
  return undefined;
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
      errors: result.error,
      data: undefined
    };
  }

  // Validate relationships
  const relationshipErrors = await validateCustomerSalesRelationships(data);

  if (relationshipErrors) {
    return {
      success: false,
      errors: relationshipErrors,
      data: undefined
    };
  }

  // Validate business logic
  if (data.total_purchases !== undefined) {
    // Use explicit typing with the SalesRecord interface to avoid deep recursion
    const salesResponse = await supabase
      .from('sales')
      .select('amount, created_at')
      .eq('customer_id', data.id);

    if (salesResponse.error) {
      return {
        success: false,
        errors: new z.ZodError([{
          code: z.ZodIssueCode.custom,
          message: `Database error: ${salesResponse.error.message}`,
          path: ['database']
        }]),
        data: undefined
      };
    }

    // Explicitly type the sales data as SalesRecord[] to avoid recursion
    const sales = salesResponse.data as SalesRecord[] || [];
    const actualTotalPurchases = sales.length;

    if (data.total_purchases !== actualTotalPurchases) {
      return {
        success: false,
        errors: new z.ZodError([{
          code: z.ZodIssueCode.custom,
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
