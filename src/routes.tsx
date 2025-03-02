
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
  const { user, isAdmin, isSuperAdmin, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Index /> : <Navigate to="/auth" />} />
      <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
      <Route path="/settings" element={user ? <Settings /> : <Navigate to="/auth" />} />
      <Route path="/business" element={user ? <BusinessControl /> : <Navigate to="/auth" />} />
      <Route path="/chat" element={user ? <Chat /> : <Navigate to="/auth" />} />
      <Route path="/upload" element={user ? <Upload /> : <Navigate to="/auth" />} />
      
      {/* Admin Routes */}
      <Route path="/admin/stores" element={user && isSuperAdmin ? <StoreManagement /> : <Navigate to="/auth" />} />
      <Route path="/admin/roles" element={user && isSuperAdmin ? <RoleDashboard /> : <Navigate to="/auth" />} />
      <Route path="/admin/stores/:storeId" element={user && isAdmin ? <StoreDetails /> : <Navigate to="/auth" />} />
      <Route path="/admin/stores/:storeId/roles" element={user && isAdmin ? <RoleDashboard /> : <Navigate to="/auth" />} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
