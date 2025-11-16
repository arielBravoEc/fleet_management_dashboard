import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-light text-stone-900 mb-4">Oops!</h1>
        <p className="text-lg text-stone-600 mb-4">
          {isRouteErrorResponse(error)
            ? `Error ${error.status}: ${error.statusText}`
            : 'Ha ocurrido un error inesperado'}
        </p>
        <Link
          to="/"
          className="inline-block bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-lg font-medium hover:from-amber-700 hover:to-amber-800 transition-all"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
