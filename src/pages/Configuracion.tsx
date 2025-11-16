export default function ConfiguracionPage() {
  return (
    <div className="h-full bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-light text-stone-900 mb-8">
          Configuración
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-stone-600">
            Panel de configuración del sistema de gestión de flotas.
          </p>
          <p className="text-stone-500 text-sm mt-4">
            Aquí se podrán configurar parámetros del sistema, modelos de ML,
            umbrales de alertas y preferencias de usuario.
          </p>
        </div>
      </div>
    </div>
  );
}
