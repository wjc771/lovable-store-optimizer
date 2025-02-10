
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import SmartActionCard from "./SmartActionCard";
import { useToast } from "@/hooks/use-toast";

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

      return data || [];
    },
  });

  const handleDismiss = async (id: string) => {
    const { error } = await supabase
      .from('smart_actions')
      .update({ status: 'dismissed', dismissed_at: new Date().toISOString() })
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

  if (isLoading) {
    return <div className="space-y-4">
      <div className="h-32 animate-pulse bg-gray-100 rounded-lg"></div>
      <div className="h-32 animate-pulse bg-gray-100 rounded-lg"></div>
    </div>;
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
            onDismiss={() => handleDismiss(action.id)}
          />
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No actions to display</p>
        </div>
      )}
    </div>
  );
};

export default SmartActionsFeed;
