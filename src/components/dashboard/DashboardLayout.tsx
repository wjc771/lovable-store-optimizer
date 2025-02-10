
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Store, Settings, LogOut } from "lucide-react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [storeName] = useState("My Store");

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
              <Button variant="ghost" size="icon">
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
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {}}
            >
              <Store className="mr-2 h-5 w-5" />
              Stores
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {}}
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
