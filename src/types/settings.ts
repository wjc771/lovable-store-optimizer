
export interface StaffMember {
  id: string;
  name: string;
  status: "active" | "inactive";
  positions: string[];
  position_ids: string[];
}

export interface Position {
  id: string;
  name: string;
  is_managerial: boolean;
  permissions: {
    sales: boolean;
    inventory: boolean;
    financial: boolean;
    customers: boolean;
    staff: boolean;
    settings: boolean;
  };
}

export interface StaffMemberInput {
  name: string;
  status: "active" | "inactive";
  position_ids: string[];
}

export interface PositionInput {
  name: string;
  is_managerial: boolean;
  permissions: {
    sales: boolean;
    inventory: boolean;
    financial: boolean;
    customers: boolean;
    staff: boolean;
    settings: boolean;
  };
}

export interface Customer {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
  store_id?: string;
  total_purchases?: number;
  last_purchase_date?: string;
}
