
import { DollarSign, Package, AlertCircle, Bell, Clock, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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

const getPriorityColor = (priority: ActionPriority) => {
  switch (priority) {
    case 'high':
      return 'bg-red-50 border-red-100';
    case 'medium':
      return 'bg-yellow-50 border-yellow-100';
    default:
      return 'bg-blue-50 border-blue-100';
  }
};

const getActionDetails = (type: ActionType, metadata: ActionMetadata) => {
  switch (type) {
    case 'revenue_alert':
      return metadata.percentageChange ? (
        <p className="text-sm text-gray-600">
          {metadata.percentageChange > 0 ? '↑' : '↓'} {Math.abs(metadata.percentageChange)}% from expected
          {metadata.suggestion && (
            <span className="block mt-1 text-gray-500">{metadata.suggestion}</span>
          )}
        </p>
      ) : null;
    case 'inventory_alert':
      return metadata.currentStock !== undefined ? (
        <p className="text-sm text-gray-600">
          Current stock: {metadata.currentStock} units
          {metadata.suggestedSupplier && (
            <span className="block mt-1 text-gray-500">Suggested supplier: {metadata.suggestedSupplier}</span>
          )}
        </p>
      ) : null;
    case 'payment_reminder':
      return metadata.amount ? (
        <p className="text-sm text-gray-600">
          Amount: R$ {metadata.amount.toFixed(2)}
          {metadata.dueDate && (
            <span className="block mt-1 text-gray-500">Due: {new Date(metadata.dueDate).toLocaleDateString()}</span>
          )}
        </p>
      ) : null;
    default:
      return null;
  }
};

const getActionButton = (type: ActionType, onAction?: () => void) => {
  switch (type) {
    case 'revenue_alert':
      return onAction && (
        <Button variant="default" size="sm" onClick={onAction}>
          View Report
        </Button>
      );
    case 'inventory_alert':
      return onAction && (
        <Button variant="default" size="sm" onClick={onAction}>
          Order Stock
        </Button>
      );
    case 'payment_reminder':
      return onAction && (
        <Button variant="default" size="sm" onClick={onAction}>
          Process Payment
        </Button>
      );
    default:
      return onAction && (
        <Button variant="default" size="sm" onClick={onAction}>
          Take Action
        </Button>
      );
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
      "transition-all duration-300 hover:shadow-md",
      getPriorityColor(priority),
      "border animate-in fade-in-0 slide-in-from-bottom-5"
    )}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-white p-2 shadow-sm">
            {getActionIcon(type)}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="mt-1 text-sm text-gray-600">{description}</p>
                {getActionDetails(type, metadata)}
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
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                {getActionButton(type, onAction)}
                <Button variant="ghost" size="sm" className="gap-1">
                  <Clock className="h-4 w-4" />
                  {formatDistanceToNow(new Date(created_at), { addSuffix: true })}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartActionCard;
