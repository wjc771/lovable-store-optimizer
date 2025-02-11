
import { z } from 'zod';
import { schemas } from './schemas';

export type ValidationResult = {
  success: boolean;
  errors?: z.ZodError;
  data?: any;
};

// Export TableNames type only here
export type TableNames = keyof typeof schemas;

