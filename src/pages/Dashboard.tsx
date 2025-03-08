
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Users, Bell } from "lucide-react";
import SmartActionsFeed from "@/components/dashboard/SmartActionsFeed";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePermissions } from "@/hooks/usePermissions";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Dashboard = () => {
  const { isManager, loading } = usePermissions();

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

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Removendo a restrição de acesso apenas para gerentes para permitir que qualquer usuário acesse o dashboard
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
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
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalCustomers || 0}</div>
            </CardContent>
          </Card>
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Smart Actions</h3>
            <Bell className="h-5 w-5 text-muted-foreground" />
          </div>
          <SmartActionsFeed />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
