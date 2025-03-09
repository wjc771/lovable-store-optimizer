
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import type { ValidationResult } from "../types";

// Customer schema definition
const CustomerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  total_purchases: z.number().optional(),
});

export interface CustomersValidationData {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  total_purchases?: number;
}

// Basic validation using Zod schema
const validateCustomerBasics = (data: CustomersValidationData): z.SafeParseReturnType<any, any> => {
  return CustomerSchema.safeParse(data);
};

// Helper function to validate if a customer exists
const validateCustomerExists = async (customerId: string): Promise<boolean> => {
  // Check if customer exists
  const { data, error } = await supabase
    .from('customers')
    .select('id')
    .eq('id', customerId)
    .single();
    
  if (error || !data) {
    return false;
  }
  
  return true;
}

// Main validation function
export const validateCustomer = async (data: CustomersValidationData): Promise<ValidationResult> => {
  // First, validate the basic structure using Zod
  const basicValidation = validateCustomerBasics(data);
  
  if (!basicValidation.success) {
    return {
      success: false,
      errors: basicValidation.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }))
    };
  }
  
  // If we have an ID, verify that the customer exists
  if (data.id) {
    const customerExists = await validateCustomerExists(data.id);
    if (!customerExists) {
      return {
        success: false,
        errors: [{
          path: 'id',
          message: 'Customer does not exist'
        }]
      };
    }
  }
  
  // If all validations pass, return success
  return {
    success: true,
    data: data
  };
};

// Export the validator for use in other modules
export const customersValidator = validateCustomer;
