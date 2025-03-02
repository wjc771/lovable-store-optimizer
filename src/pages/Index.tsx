
import { useAuth } from "@/contexts/AuthContext";
import SmartActionsFeed from "@/components/dashboard/SmartActionsFeed";
import { usePermissions } from "@/hooks/usePermissions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

const Index = () => {
  const { user, isSuperAdmin } = useAuth();
  const { isManager, loading: permissionsLoading } = usePermissions();
  const { t } = useTranslation();
  const [isComponentMounted, setIsComponentMounted] = useState(false);

  // Log lifecycle events to help troubleshoot rendering issues
  useEffect(() => {
    console.log("Index page mounted");
    setIsComponentMounted(true);
    
    return () => {
      console.log("Index page unmounted");
      setIsComponentMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isComponentMounted) {
      console.log("Index: User or permissions changed", { 
        userExists: !!user, 
        isSuperAdmin, 
        isManager,
        permissionsLoading 
      });
    }
  }, [user, isSuperAdmin, isManager, permissionsLoading, isComponentMounted]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
        // Verificar autenticação
        if (!user) throw new Error("User not authenticated");
        
        // Para dados de estatísticas de exemplo
        return {
          totalSales: 0,
          totalProducts: 0,
          totalCustomers: 0
        };
        
        // Quando o backend estiver pronto, implementaremos esta lógica
        /*
        const promises = [
          // Get total sales
          supabase
            .from('sales')
            .select('amount')
            .eq('status', 'completed'),
          // Get total products
          supabase
            .from('products')
            .select('id', { count: 'exact' }),
          // Get total customers
          supabase
            .from('customers')
            .select('id', { count: 'exact' })
        ];

        const [salesResponse, productsResponse, customersResponse] = await Promise.all(promises);

        const totalSales = salesResponse.data?.reduce((sum, sale) => {
          if ('amount' in sale) {
            return sum + Number(sale.amount);
          }
          return sum;
        }, 0) || 0;
        
        const totalProducts = productsResponse.count || 0;
        const totalCustomers = customersResponse.count || 0;

        return {
          totalSales,
          totalProducts,
          totalCustomers
        };
        */
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
        return {
          totalSales: 0,
          totalProducts: 0,
          totalCustomers: 0
        };
      }
    },
    enabled: !!user, // Only run query if user exists
    retry: false,
  });

  // Agora temos um fluxo simplificado, pois o controle de autenticação e redirecionamento
  // estão centralizados no componente de rotas
  
  // Se o usuário não tiver permissões, mostrar mensagem de acesso negado
  if (permissionsLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Se não for manager ou superadmin, mostrar mensagem de acesso limitado
  if (!isManager && !isSuperAdmin) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertDescription>
            {t('dashboard.permissions.noAccess', 'You do not have access to this section')}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Renderização principal do dashboard
  return (
    <div className="space-y-8 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {t('dashboard.title', 'Dashboard')}
        </h1>
      </div>

      {/* Metrics Cards Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.totalSales', 'Total Sales')}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.totalSales?.toFixed(2) || '0.00'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.products', 'Products')}
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.customers', 'Customers')}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCustomers || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Actions Section */}
      <section id="smart-actions" className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">
            {t('dashboard.smartActions', 'Smart Actions')}
          </h2>
          <p className="text-muted-foreground">
            {t('dashboard.actionDescription', 'Actions that require your attention')}
          </p>
        </div>
        <SmartActionsFeed />
      </section>
    </div>
  );
};

export default Index;
