
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Store, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [storeName] = useState("My Store");
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<'stores' | 'upload'>('upload');

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "Successfully logged out",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  const scrollToSection = (section: 'stores' | 'upload') => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">{storeName}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white h-[calc(100vh-4rem)] border-r">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeSection === 'stores' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => scrollToSection('stores')}
            >
              <Store className="mr-2 h-5 w-5" />
              Stores
            </Button>
            <Button
              variant={activeSection === 'upload' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => scrollToSection('upload')}
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
