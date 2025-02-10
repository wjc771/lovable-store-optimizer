
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SmartActionCard from "./SmartActionCard";
import { useToast } from "@/hooks/use-toast";
import type { SmartAction } from "@/types/smart-actions";

const SmartActionsFeed = () => {
  const { toast } = useToast();

  const { data: actions, isLoading } = useQuery({
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
        // Navigate to revenue report or show modal
        toast({
          title: "Opening Revenue Report",
          description: "Navigating to detailed revenue analysis",
        });
        break;
      case 'inventory_alert':
        // Open reorder form or navigate to inventory
        toast({
          title: "Opening Stock Order",
          description: "Preparing to reorder inventory",
        });
        break;
      case 'payment_reminder':
        // Open payment processing or navigate to finances
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
