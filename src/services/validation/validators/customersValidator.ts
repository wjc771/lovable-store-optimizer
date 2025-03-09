
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { CustomerSchema } from "../schemas";
import type { CustomersValidationData, ValidationResult } from "../types";

// Basic validation using Zod schema
const validateCustomerBasics = (data: CustomersValidationData): z.SafeParseReturnType<CustomersValidationData, CustomersValidationData> => {
  return CustomerSchema.safeParse(data);
};

// Helper function to validate customer exists
const validateCustomerExists = async (id: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('customers')
    .select('id')
    .eq('id', id)
    .single();
    
  if (error || !data) {
    return false;
  }
  
  return true;
}

// Helper function to validate sales relationships for a customer
const validateCustomerSalesRelationships = async (customerId: string): Promise<boolean> => {
  // Check if customer has valid sales relationships
  const { data, error } = await supabase
    .from('sales')
    .select('id')
    .eq('customer_id', customerId)
    .limit(1);
    
  if (error || !data || data.length === 0) {
    return false;
  }
  
  return true;
};

// Main validation function
export const validateCustomer = async (data: CustomersValidationData): Promise<ValidationResult> => {
  // Basic validation
  const basicValidation = validateCustomerBasics(data);
  if (!basicValidation.success) {
    return {
      success: false,
      errors: basicValidation.error,
    };
  }

  // Existence validation
  if (data.id) {
    const exists = await validateCustomerExists(data.id);
    if (!exists) {
      return {
        success: false,
        message: `Customer with id ${data.id} does not exist`,
      };
    }
  }

  // Perform additional validation if needed
  if (data.total_purchases !== undefined) {
    const { data: salesData, error } = await supabase
      .from('sales')
      .select('amount')
      .eq('customer_id', data.id);
      
    if (error) {
      return {
        success: false,
        message: `Error validating customer purchases: ${error.message}`,
      };
    }
  }

  return {
    success: true,
  };
};
