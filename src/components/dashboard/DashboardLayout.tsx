
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Upload, Settings, LogOut, PieChart, MessageSquare, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useStore } from "@/contexts/StoreContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePermissions } from "@/hooks/usePermissions";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { store } = useStore();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { isManager, isSaasAdmin } = usePermissions();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

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

  const navigationItems = [
    {
      icon: LayoutDashboard,
      label: t('common.dashboard'),
      path: "/",
      show: true
    },
    {
      icon: PieChart,
      label: t('common.business'),
      path: "/business",
      show: isManager || isSaasAdmin
    },
    {
      icon: Upload,
      label: t('common.upload'),
      path: "/upload",
      show: true
    },
    {
      icon: MessageSquare,
      label: t('common.chat'),
      path: "/chat",
      show: true
    },
    {
      icon: Settings,
      label: t('common.settings'),
      path: "/settings",
      show: isManager || isSaasAdmin
    }
  ];

  const NavigationContent = () => (
    <nav className="space-y-2">
      {navigationItems.filter(item => item.show).map((item) => (
        <Button
          key={item.path}
          variant={isActive(item.path) ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => {
            navigate(item.path);
            if (isMobile) setIsOpen(false);
          }}
        >
          <item.icon className="mr-2 h-5 w-5" />
          {item.label}
        </Button>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 w-full border-b border-border bg-card">
        <div className="px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {isMobile && (
              <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader className="border-b pb-4">
                    <DrawerTitle>{store?.businessName || t('common.loading')}</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4">
                    <NavigationContent />
                  </div>
                </DrawerContent>
              </Drawer>
            )}
            <h1 className="text-xl font-semibold text-foreground truncate">
              {store?.businessName || t('common.loading')}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className="sticky top-16 hidden md:flex h-[calc(100vh-4rem)] w-64 flex-col border-r border-border bg-card">
            <div className="flex-1 overflow-auto p-4">
              <NavigationContent />
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 bg-background p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
