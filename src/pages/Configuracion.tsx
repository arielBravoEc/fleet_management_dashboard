export default function ConfiguracionPage() {
  return (
    <div className="h-full p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2 py-2">
            Configuración
          </h1>
          <p className="text-slate-400 text-base sm:text-lg">
            Panel de configuración del sistema
          </p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl md:rounded-2xl shadow-2xl border border-slate-700/50 p-4 sm:p-6 md:p-8">
          <p className="text-slate-200 text-base sm:text-lg mb-4">
            Panel de configuración del sistema de gestión de flotas.
          </p>
          <p className="text-slate-400 text-sm sm:text-base mt-4">
            Aquí se podrán configurar parámetros del sistema, modelos de ML,
            umbrales de alertas y preferencias de usuario.
          </p>
        </div>
      </div>
    </div>
  );
}
