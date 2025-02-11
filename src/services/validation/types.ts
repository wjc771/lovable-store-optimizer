
import { z } from 'zod';
import { schemas } from './schemas';

export type ValidationResult<T = any> = {
  success: boolean;
  errors?: z.ZodError;
  data?: T;
};

// Export TableNames type only here
export type TableNames = keyof typeof schemas;
