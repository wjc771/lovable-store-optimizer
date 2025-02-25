
import { z } from "zod";
import type { Customer } from "@/types/settings";

const customerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  address: z.string().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type CustomerValidation = z.infer<typeof customerSchema>;

export const validateCustomer = (customer: Partial<Customer>): CustomerValidation => {
  return customerSchema.parse(customer);
};

export const validateCustomers = (customers: Partial<Customer>[]): CustomerValidation[] => {
  return z.array(customerSchema).parse(customers);
};

export const isValidCustomer = (customer: Partial<Customer>): boolean => {
  try {
    customerSchema.parse(customer);
    return true;
  } catch {
    return false;
  }
};
