
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SalesInventoryTab from "@/components/business-control/SalesInventoryTab";
import CustomersOrdersTab from "@/components/business-control/CustomersOrdersTab";
import FinancialTab from "@/components/business-control/FinancialTab";
import TeamTab from "@/components/business-control/TeamTab";
import { usePermissions } from "@/hooks/usePermissions";
import { Alert, AlertDescription } from "@/components/ui/alert";

const BusinessControl = () => {
  const { isManager, loading } = usePermissions();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isManager) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <Alert variant="destructive">
            <AlertDescription>
              You don't have permission to access this page. This page is only accessible to managers.
            </AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Business Control</h2>
        </div>
        
        <Tabs defaultValue="sales" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sales">Sales & Inventory</TabsTrigger>
            <TabsTrigger value="customers">Customers & Orders</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-4">
            <SalesInventoryTab />
          </TabsContent>
          
          <TabsContent value="customers" className="space-y-4">
            <CustomersOrdersTab />
          </TabsContent>
          
          <TabsContent value="financial" className="space-y-4">
            <FinancialTab />
          </TabsContent>
          
          <TabsContent value="team" className="space-y-4">
            <TeamTab />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BusinessControl;
