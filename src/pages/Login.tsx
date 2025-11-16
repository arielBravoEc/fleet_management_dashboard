import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Funcionalidad de login pendiente de implementación");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      <h1>Login</h1>
      {/* Panel Izquierdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-700 via-amber-600 to-yellow-600 relative overflow-hidden">
        {/* Patrón geométrico de fondo */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute border-2 border-white"
                style={{
                  width: `${150 + i * 40}px`,
                  height: `${150 + i * 40}px`,
                  top: `${-50 + i * 30}px`,
                  left: `${-50 + i * 20}px`,
                  transform: "rotate(45deg)",
                  opacity: 0.3 - i * 0.015,
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Contenido del panel izquierdo */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo/Icono */}
          <div className="mb-12">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-amber-600"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 11v8m0 0l-3-3m3 3l3-3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <ellipse
                  cx="12"
                  cy="19"
                  rx="6"
                  ry="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          {/* Mensaje principal */}
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Hello!
              <br />
            </h1>
            <p className="text-xl text-amber-50 leading-relaxed max-w-md">
              Gestiona pedidos de sombreros artesanales de paja toquilla.
              Conecta con la tradición ecuatoriana y aumenta tu productividad.
            </p>
          </div>

          {/* Footer */}
          <div className="text-sm text-amber-100">
            © 2025 Bravo Hats. Todos los derechos reservados.
          </div>
        </div>
      </div>

      {/* Panel Derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex w-16 h-16 bg-gradient-to-br from-amber-600 to-yellow-600 rounded-full items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-white"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 11v8m0 0l-3-3m3 3l3-3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <ellipse
                  cx="12"
                  cy="19"
                  rx="6"
                  ry="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Bravo Hats</h2>
          </div>

          {/* Título */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back!
            </h2>
            <p className="text-gray-600">
              Revisa nuestras guías en nuestra página web{" "}
              <a
                href="https://www.bravohats.com/en"
                target="_blank"
                className="text-amber-600 font-semibold hover:text-amber-700 underline"
              >
                Ver guías
              </a>
              <br />
              Inicia sesión para continuar.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-amber-600 focus:outline-none transition-colors bg-transparent"
                placeholder="socio@empresa.com"
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-b-2 border-gray-300 focus:border-amber-600 focus:outline-none transition-colors bg-transparent pr-12"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                "Login Now"
              )}
            </button>

            <button className="w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Login with Google
            </button>

            <div className="text-center">
              <a
                href="https://www.bravohats.com/en/contact"
                target="_blank"
                className="text-gray-500 hover:text-amber-600 text-sm"
              >
                Don't have an account?{" "}
                <span className="font-semibold underline">Write to us</span>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
