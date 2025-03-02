
import * as React from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Settings,
  BarChart3,
  MessageSquare,
  Upload,
  Store,
  ShieldCheck,
  LogOut,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Sidebar({ className, ...props }: SidebarProps) {
  const { pathname } = useLocation();
  const { signOut, isAdmin, isSuperAdmin } = useAuth();

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-background h-screen overflow-hidden",
        className
      )}
      {...props}
    >
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 p-4">
          <Link
            to="/"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary",
              pathname === "/" && "bg-muted font-medium"
            )}
          >
            <LayoutDashboard className="h-5 w-5" />
            Home
          </Link>

          <Link
            to="/dashboard"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary",
              pathname === "/dashboard" && "bg-muted font-medium"
            )}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>

          <Link
            to="/business"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary",
              pathname === "/business" && "bg-muted font-medium"
            )}
          >
            <BarChart3 className="h-5 w-5" />
            Business Control
          </Link>

          <Link
            to="/chat"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary",
              pathname === "/chat" && "bg-muted font-medium"
            )}
          >
            <MessageSquare className="h-5 w-5" />
            Chat
          </Link>

          <Link
            to="/upload"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary",
              pathname === "/upload" && "bg-muted font-medium"
            )}
          >
            <Upload className="h-5 w-5" />
            Upload
          </Link>

          {isSuperAdmin && (
            <>
              <div className="mt-2 px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                SYSTEM ADMIN
              </div>
              <Link
                to="/admin/stores"
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary",
                  pathname.startsWith("/admin/stores") && "bg-muted font-medium"
                )}
              >
                <Store className="h-5 w-5" />
                Stores
              </Link>
              <Link
                to="/admin/roles"
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary",
                  pathname === "/admin/roles" && "bg-muted font-medium"
                )}
              >
                <ShieldCheck className="h-5 w-5" />
                System Roles
              </Link>
            </>
          )}

          <Link
            to="/settings"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-foreground transition-all hover:text-primary",
              pathname === "/settings" && "bg-muted font-medium"
            )}
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </div>
      </ScrollArea>
      <div className="p-4 mt-auto border-t">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}
