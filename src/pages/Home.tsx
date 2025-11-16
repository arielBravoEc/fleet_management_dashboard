export default function HomePage() {
  return (
    <div className="h-full p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Dashboard de Monitoreo de Flotas
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Sistema inteligente de gestión de alertas con Machine Learning
          </p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl md:rounded-2xl shadow-2xl border border-slate-700/50 p-4 sm:p-6 md:p-8">
          <p className="text-slate-200 text-base sm:text-lg mb-4">
            Sistema inteligente de gestión de alertas para flotas de transporte
            público urbano mediante procesamiento avanzado de datos GPS.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
              <p className="text-cyan-400 font-semibold mb-2 text-sm sm:text-base">
                Monitoreo en Tiempo Real
              </p>
              <p className="text-slate-400 text-xs sm:text-sm">
                Alertas: Exceso de Velocidad, Detenciones No Autorizadas,
                Salidas de Ruta y Pérdidas de Señal.
              </p>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
              <p className="text-blue-400 font-semibold mb-2 text-sm sm:text-base">
                Arquitectura ML
              </p>
              <p className="text-slate-400 text-xs sm:text-sm">
                Isolation Forest + Random Forest para detección y priorización
                inteligente de alertas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
