
import { supabase } from '@/integrations/supabase/client';
import { ValidationResult, TasksValidationData } from '../types';

export async function validateTasksRelationships(
  data: TasksValidationData
): Promise<ValidationResult<TasksValidationData>> {
  if (data.staff_id) {
    const { data: staff } = await supabase
      .from('staff')
      .select('status, name')
      .eq('id', data.staff_id)
      .maybeSingle();

    if (!staff) {
      throw new Error('Staff member not found');
    }

    if (staff.status === 'inactive') {
      throw new Error(`Staff member ${staff.name} is inactive`);
    }
  }

  if (data.store_id) {
    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('id', data.store_id)
      .maybeSingle();

    if (!store) {
      throw new Error('Store not found');
    }
  }

  if (data.due_date && new Date(data.due_date) < new Date()) {
    throw new Error('Due date cannot be in the past');
  }

  return { success: true, data };
}
