
import { supabase } from '@/lib/supabase';
import { schemas } from '../schemas';
import { ValidationResult } from '../types';
import { z } from 'zod';

// Define explicit simple type to avoid recursive type issues
export interface CustomersValidationData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  total_purchases?: number;
  last_purchase_date?: string;
  [key: string]: any;
}

// Simple sales record type without references to customers
interface SimpleSalesRecord {
  amount: number;
  created_at: string;
}

// Helper function to validate sales relationships for a customer
const validateCustomerSalesRelationships = async (customerId: string): Promise<z.ZodError | undefined> => {
  // Check if customer has valid sales relationships
  const { error } = await supabase
    .from('sales')
    .select('id')
    .eq('customer_id', customerId)
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
  const relationshipError = await validateCustomerSalesRelationships(data.id);
  if (relationshipError) {
    return {
      success: false,
      errors: relationshipError,
      data: undefined
    };
  }

  // Validate business logic
  if (data.total_purchases !== undefined) {
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

    const sales = salesResponse.data || [];
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
