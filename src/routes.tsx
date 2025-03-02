
import { Navigate, Route, Routes } from "react-router-dom";
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

// A simplified ProtectedRoute component with better logging
const ProtectedRoute = ({ 
  element, 
  adminOnly = false 
}: { 
  element: JSX.Element, 
  adminOnly?: boolean 
}) => {
  const { user, isAdmin, isSuperAdmin, isLoading } = useAuth();
  
  // More detailed logging for debugging
  console.log("ProtectedRoute: Evaluating route protection", { 
    isLoading, 
    hasUser: !!user, 
    isAdmin, 
    isSuperAdmin,
    adminOnly,
    currentPath: window.location.pathname 
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    console.log("ProtectedRoute: No user, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }
  
  if (adminOnly && !(isSuperAdmin || isAdmin)) {
    console.log("ProtectedRoute: User not admin, redirecting to /");
    return <Navigate to="/" replace />;
  }
  
  console.log("ProtectedRoute: Rendering protected component");
  return element;
};

const AppRoutes = () => {
  const { user, isAdmin, isSuperAdmin, isLoading } = useAuth();
  
  console.log("Rendering AppRoutes", { 
    user: !!user, 
    isAdmin, 
    isSuperAdmin,
    currentPath: window.location.pathname
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
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
      
      {/* Protected Routes */}
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
