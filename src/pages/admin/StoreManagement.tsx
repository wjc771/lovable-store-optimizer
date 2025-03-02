
import { Button } from "@/components/ui/button";
import { useStoreManagement } from "@/hooks/useStoreManagement";
import CreateStoreDialog from "@/components/admin/stores/CreateStoreDialog";
import StoreTable from "@/components/admin/stores/StoreTable";
import StoreLoadingError from "@/components/admin/stores/StoreLoadingError";
import StoreLoadingSkeleton from "@/components/admin/stores/StoreLoadingSkeleton";

const StoreManagement = () => {
  const {
    stores,
    isLoading,
    storesError,
    refetch,
    isDialogOpen,
    setIsDialogOpen
  } = useStoreManagement();

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
        <CreateStoreDialog 
          isOpen={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        {stores && <StoreTable stores={stores} />}
      </div>
    </div>
  );
};

export default StoreManagement;
