
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

export type CustomersValidationData = z.infer<typeof CustomerSchema>;

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
        errors: new z.ZodError([{
          code: z.ZodIssueCode.custom,
          path: ["id"],
          message: `Customer with id ${data.id} does not exist`
        }])
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
        errors: new z.ZodError([{
          code: z.ZodIssueCode.custom,
          path: ["total_purchases"],
          message: `Error validating customer purchases: ${error.message}`
        }])
      };
    }
  }

  return {
    success: true,
  };
};
