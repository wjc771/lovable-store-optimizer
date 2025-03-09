// Import custom validators for each table
import { validateSalesRelationships } from './validators/salesValidator';
import { validateOrdersRelationships } from './validators/ordersValidator';
import { validateTasksRelationships } from './validators/tasksValidator';
import { validateProductsRelationships } from './validators/productsValidator';
import { customersValidator } from './validators/customersValidator';

// Export the validators functions
export { 
  validateSalesRelationships,
  validateOrdersRelationships,
  validateTasksRelationships,
  validateProductsRelationships
};

// No need to export customersValidator here since it's not a simple relationship validator
// and is already exported from the validators/index.ts file
