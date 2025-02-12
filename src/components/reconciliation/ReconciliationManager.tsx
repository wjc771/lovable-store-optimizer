
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import ReconciliationDashboard from "./ReconciliationDashboard";
import ReconciliationDetails from "./ReconciliationDetails";
import ReconciliationUpload from "./ReconciliationUpload";

interface Props {
  storeId: string;
}

export default function ReconciliationManager({ storeId }: Props) {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">{t('reconciliation.tabs.overview')}</TabsTrigger>
          <TabsTrigger value="upload">{t('reconciliation.tabs.upload')}</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="space-y-4">
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
        </TabsContent>
        <TabsContent value="upload" className="space-y-4">
          <ReconciliationUpload 
            storeId={storeId} 
            onUploadComplete={() => {
              setSelectedJobId(null);
            }} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
