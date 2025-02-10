
import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  message: string;
  response?: string;
  created_at: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to send messages",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          message: newMessage,
          user_id: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setMessages((prev) => [...prev, data as Message]);
      setNewMessage("");

      // Call edge function to process the message
      const response = await supabase.functions.invoke('process-message', {
        body: { messageId: data.id },
      });

      if (response.error) throw response.error;

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] glass-card rounded-lg p-6">
      <ScrollArea className="flex-1 pr-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-2">
              <div className="bg-primary/10 p-3 rounded-lg">
                <p>{msg.message}</p>
              </div>
              {msg.response && (
                <div className="bg-secondary/10 p-3 rounded-lg ml-4">
                  <p>{msg.response}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
