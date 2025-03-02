
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

const AppRoutes = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
      
      {/* Protected Routes - Redirect to auth if not logged in */}
      <Route path="/" element={user ? <Index /> : <Navigate to="/auth" />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
      <Route path="/settings" element={user ? <Settings /> : <Navigate to="/auth" />} />
      <Route path="/business" element={user ? <BusinessControl /> : <Navigate to="/auth" />} />
      <Route path="/chat" element={user ? <Chat /> : <Navigate to="/auth" />} />
      <Route path="/upload" element={user ? <Upload /> : <Navigate to="/auth" />} />
      
      {/* Admin Routes - All authenticated users for now */}
      <Route 
        path="/admin/stores" 
        element={user ? <StoreManagement /> : <Navigate to="/auth" />} 
      />
      <Route 
        path="/admin/roles" 
        element={user ? <RoleDashboard /> : <Navigate to="/auth" />} 
      />
      <Route 
        path="/admin/stores/:storeId" 
        element={user ? <StoreDetails /> : <Navigate to="/auth" />} 
      />
      <Route 
        path="/admin/stores/:storeId/roles" 
        element={user ? <RoleDashboard /> : <Navigate to="/auth" />} 
      />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
