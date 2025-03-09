
import { supabase } from '@/lib/supabase';
import { schemas } from '../schemas';
import { ValidationResult, CustomersValidationData } from '../types';
import { z } from 'zod';

// Explicitly define a simple record type to avoid circular references
interface SimpleSalesRecord {
  amount: number;
  created_at: string;
}

// Helper function to validate sales relationships for a customer
const validateCustomerSalesRelationships = async (data: CustomersValidationData): Promise<z.ZodError | undefined> => {
  // Check if customer has valid sales relationships
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

export const customersValidator = async (data: CustomersValidationData): Promise<ValidationResult<CustomersValidationData>> => {
  // Schema validation using the customers schema from schemas.ts
  const customerSchema = schemas.customers;
  const result = customerSchema.safeParse(data);
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error,
      data: undefined
    };
  }

  // Relationship validation
  const relationshipError = await validateCustomerSalesRelationships(data);
  if (relationshipError) {
    return {
      success: false,
      errors: relationshipError,
      data: undefined
    };
  }

  // Validate business logic
  if (data.total_purchases !== undefined) {
    // Use a type assertion to break the type recursion
    const salesResponse = await supabase
      .from('sales')
      .select('amount, created_at');
      
    // Explicitly type the response to avoid deep recursion
    const typedResponse: { 
      data: SimpleSalesRecord[] | null, 
      error: { message: string } | null 
    } = salesResponse as any;
    
    if (typedResponse.error) {
      return {
        success: false,
        errors: new z.ZodError([{
          code: z.ZodIssueCode.custom,
          message: `Database error: ${typedResponse.error.message}`,
          path: ['database']
        }]),
        data: undefined
      };
    }

    const sales = typedResponse.data || [];
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
    data: data,
    errors: undefined
  };
};
