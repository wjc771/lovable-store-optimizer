
import { supabase } from "@/lib/supabase";
import { StaffMember, StaffMemberInput } from "@/types/settings";

export const addStaffMember = async (data: StaffMemberInput): Promise<StaffMember> => {
  const { data: newStaff, error } = await supabase
    .from('staff')
    .insert([{
      name: data.name,
      status: data.status,
    }])
    .select()
    .single();

  if (error) throw error;

  if (data.position_ids && data.position_ids.length > 0) {
    const staffPositionsToInsert = data.position_ids.map((positionId: string) => ({
      staff_id: newStaff.id,
      position_id: positionId,
    }));

    const { error: positionsError } = await supabase
      .from('staff_positions')
      .insert(staffPositionsToInsert);

    if (positionsError) throw positionsError;
  }

  const { data: staffPositions } = await supabase
    .from('staff_positions')
    .select(`
      position_id,
      positions (name)
    `)
    .eq('staff_id', newStaff.id);

  return {
    id: newStaff.id,
    name: newStaff.name,
    status: newStaff.status as "active" | "inactive",
    positions: staffPositions?.map((sp: any) => sp.positions.name) || [],
    position_ids: staffPositions?.map((sp: any) => sp.position_id) || [],
  };
};

export const updateStaffMember = async (id: string, data: StaffMemberInput): Promise<{ positions: string[], position_ids: string[] }> => {
  const { error } = await supabase
    .from('staff')
    .update({
      name: data.name,
      status: data.status,
    })
    .eq('id', id);

  if (error) throw error;

  const { error: deleteError } = await supabase
    .from('staff_positions')
    .delete()
    .eq('staff_id', id);

  if (deleteError) throw deleteError;

  if (data.position_ids && data.position_ids.length > 0) {
    const staffPositionsToInsert = data.position_ids.map((positionId: string) => ({
      staff_id: id,
      position_id: positionId,
    }));

    const { error: insertError } = await supabase
      .from('staff_positions')
      .insert(staffPositionsToInsert);

    if (insertError) throw insertError;
  }

  const { data: staffPositions } = await supabase
    .from('staff_positions')
    .select(`
      position_id,
      positions (name)
    `)
    .eq('staff_id', id);

  return {
    positions: staffPositions?.map((sp: any) => sp.positions.name) || [],
    position_ids: staffPositions?.map((sp: any) => sp.position_id) || [],
  };
};

export const deleteStaffMember = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('staff')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
