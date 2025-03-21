
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import FileUpload from "@/components/upload/FileUpload";
import { useTranslation } from "react-i18next";

const UploadContent = () => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          {t('dashboard.upload.title')}
        </h2>
      </div>
      <FileUpload />
    </div>
  );
};

const Upload = () => {
  return (
    <DashboardLayout>
      <UploadContent />
    </DashboardLayout>
  );
};

export default Upload;
