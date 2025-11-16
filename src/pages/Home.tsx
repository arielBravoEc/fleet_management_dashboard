export default function HomePage() {
  return (
    <div className="h-full bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-light text-stone-900 mb-8">
          Dashboard de Monitoreo de Flotas
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-stone-600">
            Sistema inteligente de gestión de alertas para flotas de transporte
            público urbano.
          </p>
          <p className="text-stone-500 text-sm mt-4">
            Monitoreo en tiempo real de alertas: Exceso de Velocidad,
            Detenciones No Autorizadas, Salidas de Ruta y Pérdidas de Señal.
          </p>
        </div>
      </div>
    </div>
  );
}
