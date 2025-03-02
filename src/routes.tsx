
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import BusinessControl from "./pages/BusinessControl";
import Chat from "./pages/Chat";
import Upload from "./pages/Upload";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import StoreManagement from "./pages/admin/StoreManagement";
import StoreDetails from "./pages/admin/StoreDetails";
import RoleDashboard from "./pages/admin/RoleDashboard";
import { useAuth } from "./contexts/AuthContext";
import DashboardLayout from "./components/dashboard/DashboardLayout";

// Improved ProtectedRoute component with memoization and better navigation
const ProtectedRoute = ({ 
  element, 
  adminOnly = false,
  layoutWrapped = true
}: { 
  element: JSX.Element, 
  adminOnly?: boolean,
  layoutWrapped?: boolean
}) => {
  const { user, isAdmin, isSuperAdmin, isLoading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    console.log("ProtectedRoute: Path changed", {
      path: location.pathname,
      isLoading,
      hasUser: !!user,
    });
  }, [location.pathname, isLoading, user]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Auth check
  if (!user) {
    console.log("ProtectedRoute: No user, redirecting to /auth");
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }
  
  // Permission check
  if (adminOnly && !(isSuperAdmin || isAdmin)) {
    console.log("ProtectedRoute: User not admin, redirecting to /");
    return <Navigate to="/" replace />;
  }
  
  // Render the element with or without layout
  if (layoutWrapped) {
    return <DashboardLayout>{element}</DashboardLayout>;
  }
  
  return element;
};

const AppRoutes = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    console.log("AppRoutes: Path changed to", location.pathname, {
      hasUser: !!user,
      isLoading
    });
  }, [location.pathname, user, isLoading]);

  // Global loading state - don't show anything while auth is initializing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes - No Layout */}
      <Route 
        path="/auth" 
        element={
          user ? (
            <Navigate to="/" replace /> 
          ) : (
            <Auth />
          )
        } 
      />
      
      {/* Protected Routes - With Layout */}
      <Route path="/" element={<ProtectedRoute element={<Index />} />} />
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />
      <Route path="/business" element={<ProtectedRoute element={<BusinessControl />} />} />
      <Route path="/chat" element={<ProtectedRoute element={<Chat />} />} />
      <Route path="/upload" element={<ProtectedRoute element={<Upload />} />} />
      
      {/* Admin Routes */}
      <Route path="/admin/stores" element={<ProtectedRoute adminOnly element={<StoreManagement />} />} />
      <Route path="/admin/roles" element={<ProtectedRoute adminOnly element={<RoleDashboard />} />} />
      <Route path="/admin/stores/:storeId" element={<ProtectedRoute adminOnly element={<StoreDetails />} />} />
      <Route path="/admin/stores/:storeId/roles" element={<ProtectedRoute adminOnly element={<RoleDashboard />} />} />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
