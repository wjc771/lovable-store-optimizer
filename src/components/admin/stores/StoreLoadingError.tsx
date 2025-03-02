
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoreLoadingErrorProps {
  error: unknown;
  onRetry: () => void;
}

const StoreLoadingError = ({ error, onRetry }: StoreLoadingErrorProps) => {
  return (
    <div className="container mx-auto py-10">
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
          <h3 className="text-lg font-semibold">Error loading stores</h3>
        </div>
        <p className="mt-2">There was a problem loading the store list. Please try refreshing the page.</p>
        <p className="text-sm mt-1 text-red-600">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
      <Button 
        onClick={onRetry} 
        className="flex items-center"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Retry
      </Button>
    </div>
  );
};

export default StoreLoadingError;
