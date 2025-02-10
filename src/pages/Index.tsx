
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import LoginForm from "@/components/auth/LoginForm";
import FileUpload from "@/components/upload/FileUpload";
import ChatInterface from "@/components/chat/ChatInterface";

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <LoginForm />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-16">
        <section id="stores" className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold">Your Stores</h2>
            <p className="text-muted-foreground">
              Manage your store documents and settings
            </p>
          </div>
          <div className="grid gap-6">
            {/* Store list will be implemented later */}
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
