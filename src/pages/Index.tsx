
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import LoginForm from "@/components/auth/LoginForm";
import SmartActionsFeed from "@/components/dashboard/SmartActionsFeed";
import { usePermissions } from "@/hooks/usePermissions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { user } = useAuth();
  const { isManager, loading } = usePermissions();
  const { t } = useTranslation();

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

        {/* Smart Actions Section */}
        <section id="smart-actions" className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">
              {t('dashboard.smartActions.title', 'Smart Actions')}
            </h2>
            <p className="text-muted-foreground">
              {t('dashboard.smartActions.subtitle', 'Actions that require your attention')}
            </p>
          </div>
          <SmartActionsFeed />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Index;
