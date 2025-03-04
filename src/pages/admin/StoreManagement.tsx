
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useStoreManagement } from "@/hooks/useStoreManagement";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import CreateStoreDialog from "@/components/admin/stores/CreateStoreDialog";
import StoreTable from "@/components/admin/stores/StoreTable";
import StoreLoadingError from "@/components/admin/stores/StoreLoadingError";
import StoreLoadingSkeleton from "@/components/admin/stores/StoreLoadingSkeleton";
import { Plus, RefreshCw } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const StoreManagement = () => {
  const {
    stores,
    isLoading,
    storesError,
    refetch,
    isDialogOpen,
    setIsDialogOpen
  } = useStoreManagement();

  const content = () => {
    if (storesError) {
      return <StoreLoadingError error={storesError} onRetry={refetch} />;
    }

    if (isLoading) {
      return <StoreLoadingSkeleton />;
    }

    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Store Management</h1>
          <div className="flex gap-2">
            <Button 
              onClick={() => refetch()}
              variant="outline"
              size="icon"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create New Store
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {stores && <StoreTable stores={stores} onRefresh={refetch} />}
        </div>
        
        {/* Create store dialog */}
        <CreateStoreDialog 
          isOpen={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
        />
      </div>
    );
  };

  return (
    <DashboardLayout>
      <ErrorBoundary>
        {content()}
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default StoreManagement;
