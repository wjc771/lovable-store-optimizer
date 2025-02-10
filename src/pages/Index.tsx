
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import LoginForm from "@/components/auth/LoginForm";
import FileUpload from "@/components/upload/FileUpload";
import ChatInterface from "@/components/chat/ChatInterface";
import SmartActionsFeed from "@/components/dashboard/SmartActionsFeed";
import { usePermissions } from "@/hooks/usePermissions";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Index = () => {
  const { user } = useAuth();
  const { isManager, loading } = usePermissions();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <LoginForm />
      </div>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">Loading...</div>
      </DashboardLayout>
    );
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
      <div className="space-y-16">
        <section id="smart-actions" className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold">Smart Actions</h2>
            <p className="text-muted-foreground">
              Important alerts and actions that need your attention
            </p>
          </div>
          <SmartActionsFeed />
        </section>

        <section id="stores" className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold">Your Stores</h2>
            <p className="text-muted-foreground">
              Manage your store documents and settings
            </p>
          </div>
          <div className="grid gap-6">
            <div className="glass-card rounded-lg p-6">
              <p className="text-muted-foreground">No stores found. Create your first store to get started.</p>
            </div>
          </div>
        </section>

        <section id="upload" className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold">Upload Documents</h2>
            <p className="text-muted-foreground">
              Upload and manage your store documents
            </p>
          </div>

          <div className="grid gap-8">
            <div className="glass-card rounded-lg p-6">
              <FileUpload />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Chat with your documents</h3>
              <ChatInterface />
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Index;
