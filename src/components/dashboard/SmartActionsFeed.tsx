
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SmartActionCard from "./SmartActionCard";
import { useToast } from "@/hooks/use-toast";
import type { SmartAction } from "@/types/smart-actions";
import { useEffect } from "react";

const SmartActionsFeed = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: actions, isLoading, refetch } = useQuery({
    queryKey: ['smart-actions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('smart_actions')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching actions",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return (data || []) as SmartAction[];
    },
  });

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('smart-actions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'smart_actions'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const handleDismiss = async (id: string) => {
    const { error } = await supabase
      .from('smart_actions')
      .update({ 
        status: 'dismissed', 
        dismissed_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error dismissing action",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Action dismissed",
        description: "The action has been removed from your feed",
      });
    }
  };

  const handleAction = async (action: SmartAction) => {
    switch (action.type) {
      case 'revenue_alert':
        navigate('/reports/revenue', {
          state: {
            date: new Date().toISOString(),
            alert: action
          }
        });
        toast({
          title: "Opening Revenue Report",
          description: "Navigating to detailed revenue analysis",
        });
        break;
      case 'inventory_alert':
        navigate('/inventory/reorder', {
          state: {
            productName: action.metadata.productName,
            currentStock: action.metadata.currentStock,
            alert: action
          }
        });
        toast({
          title: "Opening Stock Order",
          description: "Preparing to reorder inventory",
        });
        break;
      case 'payment_reminder':
        navigate('/finance/payments', {
          state: {
            amount: action.metadata.amount,
            dueDate: action.metadata.dueDate,
            alert: action
          }
        });
        toast({
          title: "Processing Payment",
          description: "Opening payment processing form",
        });
        break;
      default:
        toast({
          title: "Action triggered",
          description: "Processing your request",
        });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-40 animate-pulse bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actions && actions.length > 0 ? (
        actions.map((action) => (
          <SmartActionCard
            key={action.id}
            type={action.type}
            title={action.title}
            description={action.description}
            priority={action.priority}
            metadata={action.metadata}
            created_at={action.created_at}
            onDismiss={() => handleDismiss(action.id)}
            onAction={() => handleAction(action)}
          />
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No actions to display</p>
          <p className="text-sm mt-2">All caught up! We'll notify you when there's something new.</p>
        </div>
      )}
    </div>
  );
};

export default SmartActionsFeed;
