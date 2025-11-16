import { RouterProvider as ReactRouterProvider } from 'react-router-dom'
import { Suspense } from 'react'
import { router } from '../routes'

/**
 * Componente de loading para rutas lazy-loaded
 */
function RouteLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-stone-600">Cargando...</p>
      </div>
    </div>
  )
}

/**
 * Provider del router que envuelve toda la aplicación
 */
export function RouterProvider() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <ReactRouterProvider router={router} />
    </Suspense>
  )
}
