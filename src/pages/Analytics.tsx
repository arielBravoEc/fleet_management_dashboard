export default function AnalyticsPage() {
  return (
    <div className="h-full bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-light text-stone-900 mb-8">Analytics</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-stone-600">
            Panel de análisis y métricas del sistema de gestión de flotas.
          </p>
          <p className="text-stone-500 text-sm mt-4">
            Aquí se mostrarán los análisis de alertas, métricas de rendimiento y
            visualizaciones de datos GPS.
          </p>
        </div>
      </div>
    </div>
  );
}
