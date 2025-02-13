
export type ActionType = 'revenue_alert' | 'inventory_alert' | 'payment_reminder' | 'general';
export type ActionPriority = 'low' | 'medium' | 'high';
export type ActionStatus = 'active' | 'dismissed';

export interface ActionMetadata {
  currentValue?: number;
  expectedValue?: number;
  percentageChange?: number;
  suggestion?: string;
  productName?: string;
  currentStock?: number;
  reorderPoint?: number;
  suggestedSupplier?: string;
  amount?: number;
  dueDate?: string;
  paymentType?: string;
}

export interface SmartAction {
  id: string;
  type: ActionType;
  title: string;
  description: string;
  priority: ActionPriority;
  metadata: ActionMetadata;
  status: ActionStatus;
  created_at: string;
  expires_at?: string;
  dismissed_at?: string;
  store_id?: string;
}

