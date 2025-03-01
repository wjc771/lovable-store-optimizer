
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAdmin = false, 
  requireSuperAdmin = false 
}) => {
  const { user, isLoading, isAdmin, isSuperAdmin } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Se carregando, não fazer nada ainda
    if (isLoading) return;

    // Se não estiver autenticado, redirecionar para login
    if (!user) {
      navigate('/auth');
      return;
    }

    // Verificar permissões de administrador
    if (requireSuperAdmin && !isSuperAdmin) {
      navigate('/');
      return;
    }

    if (requireAdmin && !isAdmin && !isSuperAdmin) {
      navigate('/');
      return;
    }
  }, [user, isLoading, isAdmin, isSuperAdmin, navigate, requireAdmin, requireSuperAdmin]);

  // Mostrar nada enquanto carrega ou redireciona
  if (isLoading || !user || (requireAdmin && !isAdmin) || (requireSuperAdmin && !isSuperAdmin)) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  // Renderizar o conteúdo protegido
  return <>{children}</>;
};
