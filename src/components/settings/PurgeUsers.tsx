
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Trash2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const PurgeUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePurgeUsers = async () => {
    setIsLoading(true);
    try {
      // Step 1: Call the Edge Function to delete auth users
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        throw new Error("Not authenticated");
      }

      console.log("Calling delete-users function");
      const response = await fetch(`${window.location.origin}/functions/v1/delete-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          preserveEmails: ['wjc771@gmail.com', 'jotafieldsfirst@gmail.com']
        })
      });

      let result;
      try {
        // Handle potentially empty responses
        const text = await response.text();
        console.log("Response text:", text);
        result = text && text.trim() ? JSON.parse(text) : {};
      } catch (e) {
        console.error("Error parsing response:", e);
        throw new Error("Failed to parse server response");
      }

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete users');
      }

      console.log("User deletion result:", result);

      // Step 2: Delete related data from other tables
      if (user?.id) {
        // Get all users except current user
        const { data: profiles, error: fetchError } = await supabase
          .from('profiles')
          .select('id')
          .neq('id', user.id);

        if (fetchError) {
          console.error("Error fetching profiles:", fetchError);
          throw fetchError;
        }

        if (profiles && profiles.length > 0) {
          const userIds = profiles.map(profile => profile.id);
          console.log(`Found ${userIds.length} profiles to clean up`);
          
          try {
            // Delete tasks
            const staffResult = await supabase.from('staff').select('id').in('user_id', userIds);
            const staffIds = staffResult.data?.map(s => s.id) || [];
            
            if (staffIds.length > 0) {
              console.log(`Deleting tasks for ${staffIds.length} staff members`);
              await supabase.from('tasks').delete().in('staff_id', staffIds);
              
              // Delete staff positions
              console.log("Deleting staff positions");
              await supabase.from('staff_positions').delete().in('staff_id', staffIds);
            }
            
            // Delete staff
            console.log("Deleting staff records");
            await supabase.from('staff').delete().in('user_id', userIds);
            
            // Finally, delete profiles
            console.log("Deleting user profiles");
            await supabase.from('profiles').delete().in('id', userIds);
          } catch (error) {
            console.error("Error cleaning up user data:", error);
            throw error;
          }
        }
      }

      toast({
        title: "Operação concluída",
        description: `Todos os usuários foram excluídos, exceto o administrador.`,
      });
    } catch (error) {
      console.error('Error purging users:', error);
      toast({
        title: "Erro ao excluir usuários",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao tentar excluir os usuários.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }
  };

  return (
    <>
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <Trash2 className="mr-2 h-5 w-5" />
            Excluir Usuários
          </CardTitle>
          <CardDescription>
            Excluir todos os usuários e dados associados, exceto o administrador (wjc771@gmail.com)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={() => setShowConfirmation(true)}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Excluindo..." : "Excluir Todos os Usuários"}
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-600" />
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação excluirá permanentemente todos os usuários e dados associados, exceto o administrador (wjc771@gmail.com).
              <br /><br />
              <span className="font-bold text-red-600">Esta ação não pode ser desfeita!</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handlePurgeUsers}
              className="bg-red-600 hover:bg-red-700"
            >
              Sim, excluir todos
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
