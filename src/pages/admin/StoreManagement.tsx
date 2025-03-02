
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const StoreManagement = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page since this functionality is no longer available
    navigate('/', { replace: true });
  }, [navigate]);

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Redirecionando...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Esta funcionalidade não está mais disponível.</p>
            <Button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StoreManagement;
