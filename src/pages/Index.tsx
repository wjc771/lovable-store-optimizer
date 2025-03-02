
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import SmartActionsFeed from "@/components/dashboard/SmartActionsFeed";
import { usePermissions } from "@/hooks/usePermissions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const { user, isSuperAdmin } = useAuth();
  const { isManager, loading } = usePermissions();
  const { t } = useTranslation();

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      try {
        // Verify authentication
        if (!user) throw new Error("User not authenticated");
        
        // For example stats data
        return {
          totalSales: 0,
          totalProducts: 0,
          totalCustomers: 0
        };
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
        return {
          totalSales: 0,
          totalProducts: 0,
          totalCustomers: 0
        };
      }
    },
    retry: false,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <LoginForm />
      </div>
    );
  }

  // If loading permissions, show loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          {t('common.loading', 'Loading...')}
        </div>
      </DashboardLayout>
    );
  }

  // Allow access for super admins or managers
  if (!isManager && !isSuperAdmin) {
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
    </DashboardLayout>
  );
};

export default Index;
