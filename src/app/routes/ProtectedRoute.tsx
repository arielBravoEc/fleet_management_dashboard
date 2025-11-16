import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Componente para proteger rutas que requieren autenticación
 * Actualmente redirige a login, pero puede extenderse para verificar
 * el estado de autenticación real
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // TODO: Implementar verificación real de autenticación
  // Por ejemplo, usando un hook de auth o store de Zustand
  // const { isAuthenticated } = useAuth()

  // Por ahora, no permitimos acceso
  const isAuthenticated = true; // Esto debería venir de tu store/hook de auth

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
