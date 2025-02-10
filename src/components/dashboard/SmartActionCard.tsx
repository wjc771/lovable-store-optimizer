
import { DollarSign, Package, AlertCircle, Bell, Clock, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { type ActionType, type ActionPriority, type ActionMetadata } from "@/types/smart-actions";

interface SmartActionProps {
  type: ActionType;
  title: string;
  description: string;
  priority: ActionPriority;
  metadata: ActionMetadata;
  created_at: string;
  onDismiss?: () => void;
  onAction?: () => void;
}

const getActionIcon = (type: ActionType) => {
  switch (type) {
    case 'revenue_alert':
      return <DollarSign className="h-5 w-5 text-yellow-500" />;
    case 'inventory_alert':
      return <Package className="h-5 w-5 text-blue-500" />;
    case 'payment_reminder':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

const getPriorityColor = (priority: ActionPriority, type: ActionType) => {
  switch (type) {
    case 'revenue_alert':
      return 'bg-red-50';
    case 'inventory_alert':
      return 'bg-yellow-50';
    case 'payment_reminder':
      return 'bg-red-50';
    default:
      return 'bg-gray-50';
  }
};

const getActionButton = (type: ActionType) => {
  switch (type) {
    case 'revenue_alert':
      return 'View Report';
    case 'inventory_alert':
      return 'Order Stock';
    case 'payment_reminder':
      return 'Process Payment';
    default:
      return 'Take Action';
  }
};

const SmartActionCard = ({ 
  type, 
  title, 
  description, 
  priority, 
  metadata,
  created_at, 
  onDismiss, 
  onAction 
}: SmartActionProps) => {
  return (
    <Card className={cn(
      "transition-all duration-300",
      getPriorityColor(priority, type),
      "animate-in fade-in-0 slide-in-from-bottom-5"
    )}>
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-white p-2 shadow-sm">
            {getActionIcon(type)}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
                {type === 'revenue_alert' && metadata.percentageChange && (
                  <p className="text-sm text-gray-600">
                    ↓ {Math.abs(metadata.percentageChange)}% from expected
                  </p>
                )}
                {type === 'inventory_alert' && metadata.currentStock !== undefined && (
                  <p className="text-sm text-gray-600">
                    Current stock: {metadata.currentStock} units
                  </p>
                )}
                {metadata.suggestion && (
                  <p className="text-sm text-gray-600">{metadata.suggestion}</p>
                )}
                {type === 'payment_reminder' && metadata.amount && (
                  <>
                    <p className="text-sm text-gray-600">
                      Amount: R$ {metadata.amount.toFixed(2)}
                    </p>
                    {metadata.dueDate && (
                      <p className="text-sm text-gray-600">
                        Due: {new Date(metadata.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </>
                )}
              </div>
              {onDismiss && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDismiss}
                  className="h-8 w-8 text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="h-5 w-5" />
                </Button>
              )}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Button
                variant="default"
                className="bg-black text-white hover:bg-gray-800"
                size="sm"
                onClick={onAction}
              >
                {getActionButton(type)}
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-500">
                <Clock className="mr-2 h-4 w-4" />
                {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SmartActionCard;
