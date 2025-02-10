
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Upload, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [storeName] = useState("My Store");
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

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

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">{storeName}</h1>
            </div>
            <div className="flex items-center space-x-4">
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
              variant={isActive("/") ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => navigate("/")}
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
            <Button
              variant={isActive("/upload") ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => navigate("/upload")}
            >
              <Upload className="mr-2 h-5 w-5" />
              Upload
            </Button>
            <Button
              variant={isActive("/settings") ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => navigate("/settings")}
            >
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>
          </nav>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
