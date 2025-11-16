import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { ROUTES } from "./routes.constants";
import { Layout } from "@/shared/components/Layout/Layout";

// Lazy loading de páginas para mejor performance
const HomePage = lazy(() => import("@/pages/Home"));
const AnalyticsPage = lazy(() => import("@/pages/Analytics"));
const ConfiguracionPage = lazy(() => import("@/pages/Configuracion"));
const LoginPage = lazy(() => import("@/pages/Login"));

// Componente de error para rutas
const ErrorPage = lazy(() => import("@/pages/Error"));

// Crear el router con todas las rutas
export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: ROUTES.HOME,
    element: (
      <ProtectedRoute>
        <Layout>
          <HomePage />
        </Layout>
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: ROUTES.ANALYTICS,
    element: (
      <ProtectedRoute>
        <Layout>
          <AnalyticsPage />
        </Layout>
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: ROUTES.CONFIGURACION,
    element: (
      <ProtectedRoute>
        <Layout>
          <ConfiguracionPage />
        </Layout>
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
]);
