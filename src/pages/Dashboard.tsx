
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart } from "recharts";
import { DollarSign, Package, Users, Bell, RefreshCw, ArrowUp, ArrowDown, Activity, AlertTriangle } from "lucide-react";
import SmartActionsFeed from "@/components/dashboard/SmartActionsFeed";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { usePermissions } from "@/hooks/usePermissions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Dashboard = () => {
  const { isManager, loading } = usePermissions();
  const [generatingActions, setGeneratingActions] = useState(false);

  // Let user know we're trying to load data
  useEffect(() => {
    toast.info("Fetching dashboard data...");
  }, []);

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
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
            .select('id', { count: 'exact' }),
          // Get recent sales for trend chart
          supabase
            .from('sales')
            .select('amount, created_at')
            .order('created_at', { ascending: false })
            .limit(7)
        ];

        const [salesResponse, productsResponse, customersResponse, recentSalesResponse] = await Promise.all(promises);

        // Handle potential errors in responses
        if (salesResponse.error) {
          console.error("Error fetching sales:", salesResponse.error);
          toast.error("Failed to fetch sales data");
          throw salesResponse.error;
        }
        
        if (productsResponse.error) {
          console.error("Error fetching products:", productsResponse.error);
          toast.error("Failed to fetch products data");
          throw productsResponse.error;
        }
        
        if (customersResponse.error) {
          console.error("Error fetching customers:", customersResponse.error);
          toast.error("Failed to fetch customers data");
          throw customersResponse.error;
        }

        if (recentSalesResponse.error) {
          console.error("Error fetching recent sales:", recentSalesResponse.error);
          toast.error("Failed to fetch sales trend data");
          throw recentSalesResponse.error;
        }

        const totalSales = salesResponse.data?.reduce((sum, sale) => {
          if ('amount' in sale) {
            return sum + Number(sale.amount);
          }
          return sum;
        }, 0) || 0;
        
        const totalProducts = productsResponse.count || 0;
        const totalCustomers = customersResponse.count || 0;

        // Process sales trend data
        const salesTrend = recentSalesResponse.data?.map(sale => ({
          date: new Date(sale.created_at).toLocaleDateString(),
          amount: Number(sale.amount)
        })) || [];

        // Get low stock products count
        const lowStockResponse = await supabase
          .from('products')
          .select('id, stock')
          .lt('stock', 20);

        if (lowStockResponse.error) {
          console.error("Error fetching low stock products:", lowStockResponse.error);
          toast.error("Failed to fetch inventory alerts");
          throw lowStockResponse.error;
        }

        const lowStockCount = lowStockResponse.data?.length || 0;

        return {
          totalSales,
          totalProducts,
          totalCustomers,
          salesTrend: salesTrend.reverse(), // Show oldest to newest
          lowStockCount
        };
      } catch (error) {
        console.error("Error in dashboard stats query:", error);
        throw error;
      }
    }
  });

  const handleGenerateSmartActions = async () => {
    try {
      setGeneratingActions(true);
      toast.info("Generating smart actions...");
      
      const { error } = await supabase.rpc('generate_smart_actions');
      
      if (error) {
        console.error("Error generating smart actions:", error);
        toast.error(`Failed to generate smart actions: ${error.message}`);
        return;
      }
      
      toast.success("Smart actions generated successfully!");
      // Force refetch of smart actions in SmartActionsFeed component
      // No need to manually trigger refetch since the subscription in SmartActionsFeed will catch the changes
    } catch (err) {
      console.error("Error invoking generate_smart_actions:", err);
      toast.error("An unexpected error occurred while generating smart actions");
    } finally {
      setGeneratingActions(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading permissions...</div>;
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading dashboard data...</div>;
  }

  if (error) {
    console.error("Dashboard error:", error);
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading dashboard data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats?.totalSales.toFixed(2) || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">
                +5.2% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <AlertTriangle className="mr-1 h-3 w-3 text-yellow-500" />
                <span>{stats?.lowStockCount || 0} low stock items</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalCustomers || 0}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.salesTrend?.length || 0} sales
              </div>
              <p className="text-xs text-muted-foreground">
                In the last week
              </p>
            </CardContent>
          </Card>
        </div>

        {stats?.salesTrend && stats.salesTrend.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[200px] w-full">
                <BarChart
                  data={stats.salesTrend}
                  index="date"
                  categories={["amount"]}
                  colors={["blue"]}
                  valueFormatter={(number) => `$${number.toFixed(2)}`}
                  yAxisWidth={48}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Smart Actions</h3>
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGenerateSmartActions}
                disabled={generatingActions}
                className="flex items-center gap-1"
              >
                <RefreshCw className={`h-4 w-4 ${generatingActions ? 'animate-spin' : ''}`} />
                {generatingActions ? 'Generating...' : 'Generate Actions'}
              </Button>
            </div>
          </div>
          <SmartActionsFeed />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
