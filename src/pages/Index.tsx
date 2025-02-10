
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import LoginForm from "@/components/auth/LoginForm";
import FileUpload from "@/components/upload/FileUpload";

const Index = () => {
  const [isAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <LoginForm />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">
            Upload and manage your store documents
          </p>
        </div>

        <div className="grid gap-8">
          <div className="glass-card rounded-lg p-6">
            <FileUpload />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
