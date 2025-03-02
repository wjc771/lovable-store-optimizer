
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { LoginForm } from "@/components/auth/LoginForm"; // Changed from default to named import
import SmartActionsFeed from "@/components/dashboard/SmartActionsFeed";
import { usePermissions } from "@/hooks/usePermissions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user } = useAuth();
  const { isManager, loading } = usePermissions();
  const { t } = useTranslation();

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
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
    }
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <LoginForm />
      </div>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          {t('common.loading', 'Loading...')}
        </div>
      </DashboardLayout>
    );
  }

  if (!isManager) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <Alert variant="destructive">
            <AlertDescription>
              {t('dashboard.permissions.noAccess', 'You do not have access to this section')}
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
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
                ${stats?.totalSales.toFixed(2) || '0.00'}
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
    </DashboardLayout>
  );
};

export default Index;
