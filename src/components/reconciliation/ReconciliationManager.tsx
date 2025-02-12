
import { useState } from "react";
import ReconciliationDashboard from "./ReconciliationDashboard";
import ReconciliationDetails from "./ReconciliationDetails";
import ReconciliationUpload from "./ReconciliationUpload";

interface Props {
  storeId: string;
}

export default function ReconciliationManager({ storeId }: Props) {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {!selectedJobId && <ReconciliationUpload storeId={storeId} onUploadComplete={() => {}} />}
      
      {selectedJobId ? (
        <ReconciliationDetails
          jobId={selectedJobId}
          onBack={() => setSelectedJobId(null)}
        />
      ) : (
        <ReconciliationDashboard
          storeId={storeId}
          onViewDetails={setSelectedJobId}
        />
      )}
    </div>
  );
}
