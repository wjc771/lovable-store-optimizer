
// Import custom validators for each table
import { validateSalesRelationships } from './validators/salesValidator';
import { validateOrdersRelationships } from './validators/ordersValidator';
import { validateTasksRelationships } from './validators/tasksValidator';
import { validateProductsRelationships } from './validators/productsValidator';
import { customersValidator } from './validators/customersValidator';

// Export all validators
export {
  validateSalesRelationships,
  validateOrdersRelationships,
  validateTasksRelationships,
  validateProductsRelationships,
  customersValidator
};
