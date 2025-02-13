
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
        console.error('Error fetching smart actions:', error);
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
    try {
      const { error } = await supabase
        .from('smart_actions')
        .update({ 
          status: 'dismissed', 
          dismissed_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Action dismissed",
        description: "The action has been removed from your feed",
      });
      
      // Atualiza a lista de ações
      refetch();
    } catch (error) {
      console.error('Error dismissing action:', error);
      toast({
        title: "Error dismissing action",
        description: "Failed to dismiss the action. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAction = async (action: SmartAction) => {
    try {
      switch (action.type) {
        case 'revenue_alert':
          navigate('/reports/revenue');
          break;
        case 'inventory_alert':
          navigate('/inventory/reorder');
          break;
        case 'payment_reminder':
          navigate('/finance/payments');
          break;
        default:
          toast({
            title: "Action triggered",
            description: "Processing your request",
          });
      }
    } catch (error) {
      console.error('Error handling action:', error);
      toast({
        title: "Error",
        description: "Failed to process the action. Please try again.",
        variant: "destructive",
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

