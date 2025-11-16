import { RouterProvider as ReactRouterProvider } from "react-router-dom";
import { Suspense } from "react";
import { Activity } from "lucide-react";
import { router } from "../routes";

/**
 * Componente de loading para rutas lazy-loaded
 */
function RouteLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="text-center">
        {/* Spinner con efecto glow */}
        <div className="relative mx-auto mb-6">
          {/* Efecto de brillo detrás */}
          <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full animate-pulse" />

          {/* Spinner principal */}
          <div className="relative w-20 h-20 border-4 border-slate-700 border-t-cyan-500 border-r-blue-500 rounded-full animate-spin mx-auto">
            <div
              className="absolute inset-0 border-4 border-transparent border-t-cyan-400 border-r-blue-400 rounded-full animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            />
          </div>

          {/* Icono central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/30 blur-lg rounded-lg" />
              <Activity className="relative w-6 h-6 text-cyan-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Texto de carga */}
        <p className="text-slate-300 text-lg font-medium mb-2">Cargando</p>
        <p className="text-slate-500 text-sm">Fleet Monitor</p>

        {/* Puntos animados */}
        <div className="flex justify-center gap-1 mt-4">
          <div
            className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Provider del router que envuelve toda la aplicación
 */
export function RouterProvider() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <ReactRouterProvider router={router} />
    </Suspense>
  );
}
