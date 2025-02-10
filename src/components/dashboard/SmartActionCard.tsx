
import { DollarSign, Package, AlertCircle, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ActionType = 'revenue_alert' | 'inventory_alert' | 'payment_reminder' | 'general';

interface SmartActionProps {
  type: ActionType;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
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

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-50 border-red-100';
    case 'medium':
      return 'bg-yellow-50 border-yellow-100';
    default:
      return 'bg-blue-50 border-blue-100';
  }
};

const SmartActionCard = ({ type, title, description, priority, onDismiss, onAction }: SmartActionProps) => {
  return (
    <Card className={`${getPriorityColor(priority)} border`}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-white p-2 shadow-sm">
            {getActionIcon(type)}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
            <div className="mt-4 flex gap-2">
              {onAction && (
                <Button variant="default" size="sm" onClick={onAction}>
                  Take Action
                </Button>
              )}
              {onDismiss && (
                <Button variant="ghost" size="sm" onClick={onDismiss}>
                  Dismiss
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartActionCard;
