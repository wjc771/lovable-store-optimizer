
import { supabase } from "@/integrations/supabase/client";
import { Position, PositionInput } from "@/types/settings";

export const addPosition = async (data: PositionInput): Promise<Position> => {
  const permissionsData = {
    sales: data.permissions.sales || false,
    inventory: data.permissions.inventory || false,
    financial: data.permissions.financial || false,
    customers: data.permissions.customers || false,
    staff: data.permissions.staff || false,
    settings: data.permissions.settings || false
  };

  const { data: newPosition, error } = await supabase
    .from('positions')
    .insert([{
      name: data.name,
      is_managerial: data.is_managerial,
      permissions: permissionsData,
    }])
    .select()
    .single();

  if (error) throw error;

  return {
    id: newPosition.id,
    name: newPosition.name || '',
    is_managerial: newPosition.is_managerial || false,
    permissions: permissionsData
  };
};

export const updatePosition = async (id: string, data: PositionInput): Promise<void> => {
  const { error } = await supabase
    .from('positions')
    .update({
      name: data.name,
      is_managerial: data.is_managerial,
      permissions: data.permissions,
    })
    .eq('id', id);

  if (error) throw error;
};

export const deletePosition = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('positions')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
