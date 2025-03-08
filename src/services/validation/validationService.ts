
import { z } from 'zod';
import { ValidationResult, TableNames } from './types';
import { schemas } from './schemas';
import {
  validateSalesRelationships,
  validateOrdersRelationships,
  validateTasksRelationships,
  validateProductsRelationships,
  customersValidator
} from './relationshipValidators';

class ValidationService {
  validateRecord(tableName: TableNames, data: any): ValidationResult {
    const schema = schemas[tableName];
    if (!schema) {
      return {
        success: false,
        errors: new z.ZodError([{
          code: z.ZodIssueCode.custom,
          path: [],
          message: `No validation schema found for table: ${tableName}`
        }])
      };
    }

    try {
      const validatedData = schema.parse(data);
      return {
        success: true,
        data: validatedData
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error
        };
      }
      throw error;
    }
  }

  async validateRelationships(tableName: TableNames, data: any): Promise<ValidationResult> {
    try {
      switch (tableName) {
        case 'sales':
          return await validateSalesRelationships(data);
        case 'orders':
          return await validateOrdersRelationships(data);
        case 'tasks':
          return await validateTasksRelationships(data);
        case 'products':
          return await validateProductsRelationships(data);
        case 'customers':
          return await customersValidator(data);
        default:
          return { success: true, data };
      }
    } catch (error) {
      return {
        success: false,
        errors: new z.ZodError([{
          code: z.ZodIssueCode.custom,
          path: [],
          message: error instanceof Error ? error.message : 'Unknown validation error'
        }])
      };
    }
  }

  validateDataIntegrity(tableName: TableNames, data: any): ValidationResult {
    return { success: true, data };
  }
}

const validationService = new ValidationService();
export default validationService;
