import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "../Sidebar/Sidebar";

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout principal de la aplicación
 * Incluye el Sidebar y el área de contenido principal
 */
export function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cerrar el menú móvil cuando la pantalla se hace más grande
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevenir scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar Desktop - visible en pantallas grandes */}
      <div className="hidden md:block">
        <Sidebar isMobile={false} onNavigate={() => {}} />
      </div>

      {/* Sidebar Mobile - drawer overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Sidebar Drawer */}
          <div className="fixed inset-y-0 left-0 z-50 md:hidden">
            <Sidebar
              isMobile={true}
              onNavigate={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Mobile Header con botón hamburguesa */}
        <div className="md:hidden sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-200"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5 text-slate-300" />
          </button>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-lg" />
              <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-1.5 rounded-lg">
                <span className="text-white text-xs font-bold">FM</span>
              </div>
            </div>
            <span className="text-sm font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Fleet Monitor
            </span>
          </div>
        </div>
        <div className="h-full">{children}</div>
      </main>
    </div>
  );
}
