
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Upload, Settings, LogOut, PieChart, MessageSquare } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/contexts/StoreContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePermissions } from "@/hooks/usePermissions";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { store } = useStore();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isManager } = usePermissions();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: t('common.success'),
        description: t('auth.logoutSuccess'),
      });
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('auth.logoutError'),
        variant: "destructive",
      });
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-foreground">
                {store?.businessName || t('common.loading')}
              </h1>
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
        <aside className="w-64 bg-card h-[calc(100vh-4rem)] border-r border-border">
          <nav className="p-4 space-y-2">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => navigate("/")}
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              {t('common.dashboard')}
            </Button>
            
            {isManager && (
              <Button
                variant={isActive("/business") ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigate("/business")}
              >
                <PieChart className="mr-2 h-5 w-5" />
                {t('common.business')}
              </Button>
            )}

            <Button
              variant={isActive("/upload") ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => navigate("/upload")}
            >
              <Upload className="mr-2 h-5 w-5" />
              {t('common.upload')}
            </Button>

            <Button
              variant={isActive("/chat") ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => navigate("/chat")}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              {t('common.chat')}
            </Button>
            
            <Button
              variant={isActive("/settings") ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => navigate("/settings")}
            >
              <Settings className="mr-2 h-5 w-5" />
              {t('common.settings')}
            </Button>
          </nav>
        </aside>

        <main className="flex-1 bg-background">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
