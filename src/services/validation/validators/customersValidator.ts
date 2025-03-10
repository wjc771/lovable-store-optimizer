
import { z } from 'zod';
import { ValidationResult } from '../types';

export const validateCustomerData = (data: any): ValidationResult => {
  try {
    // Basic schema validation
    const schema = z.object({
      name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
      phone: z.string().optional(),
      email: z.string().email({ message: "Email inválido" }).optional().nullable(),
      status: z.enum(["active", "inactive"]).optional(),
    });

    schema.parse(data);
    return { success: true, errors: undefined, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error,
        data: undefined
      };
    }
    // For non-zod errors, create a compatible format
    return {
      success: false,
      errors: new z.ZodError([
        {
          code: "custom",
          path: ["unknown"],
          message: "Erro de validação desconhecido"
        }
      ]),
      data: undefined
    };
  }
};

export const validateCustomer = (data: any): ValidationResult => {
  // First validate basic data structure
  const basicValidation = validateCustomerData(data);
  if (!basicValidation.success) {
    return basicValidation;
  }

  // Additional business logic validations
  const errors: z.ZodIssue[] = [];

  // Check for required store_id for records
  if (!data.store_id) {
    errors.push({
      code: "custom",
      path: ["store_id"],
      message: "ID da loja é obrigatório"
    });
  }

  // If we have custom errors, return them
  if (errors.length > 0) {
    return {
      success: false,
      errors: new z.ZodError(errors),
      data: undefined
    };
  }

  return { success: true, errors: undefined, data };
};

export default {
  validateCustomer
};
