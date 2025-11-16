import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  X,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
  {
    label: "Home",
    path: "/",
    icon: Home,
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: BarChart3,
  },
  {
    label: "Configuración",
    path: "/configuracion",
    icon: Settings,
  },
];

interface SidebarProps {
  isMobile?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ isMobile = false, onNavigate }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // En móviles, siempre mostrar expandido
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    if (!isMobile) {
      setIsCollapsed((prev) => !prev);
    }
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile && onNavigate) {
      onNavigate();
    }
  };

  return (
    <aside
      className={cn(
        "relative h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900",
        "border-r border-slate-700/50 backdrop-blur-xl",
        "transition-all duration-300 ease-in-out flex flex-col",
        "shadow-2xl shadow-black/20",
        isMobile ? "w-72" : isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Efecto de brillo sutil en el borde - solo en desktop */}
      {!isMobile && (
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
      )}

      {/* Header del Sidebar */}
      <div className="relative flex items-center justify-between p-4 md:p-6 border-b border-slate-700/50">
        {(!isCollapsed || isMobile) && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-lg" />
              <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
            </div>
            {!isMobile && (
              <div>
                <h2 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Fleet Monitor
                </h2>
                <p className="text-xs text-slate-400">ML Dashboard</p>
              </div>
            )}
          </div>
        )}
        {isCollapsed && !isMobile && (
          <div className="mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-lg" />
              <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          {/* Botón de cerrar en móvil */}
          {isMobile && onNavigate && (
            <button
              onClick={onNavigate}
              className={cn(
                "relative p-2 rounded-lg",
                "bg-slate-800/50 hover:bg-slate-700/50",
                "border border-slate-700/50 hover:border-cyan-500/50",
                "transition-all duration-200",
                "hover:shadow-lg hover:shadow-cyan-500/10"
              )}
              aria-label="Cerrar menú"
            >
              <X className="w-4 h-4 text-slate-300" />
            </button>
          )}
          {/* Botón de colapsar en desktop */}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className={cn(
                "relative p-2 rounded-lg",
                "bg-slate-800/50 hover:bg-slate-700/50",
                "border border-slate-700/50 hover:border-cyan-500/50",
                "transition-all duration-200",
                "hover:shadow-lg hover:shadow-cyan-500/10",
                isCollapsed && "mx-auto"
              )}
              aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-slate-300" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-slate-300" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={cn(
                "relative w-full flex items-center gap-3 px-4 py-3 rounded-xl",
                "transition-all duration-300 ease-out",
                "group",
                active
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 shadow-lg shadow-cyan-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
                isCollapsed && !isMobile && "justify-center"
              )}
              title={isCollapsed && !isMobile ? item.label : undefined}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {/* Indicador activo - barra lateral */}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full shadow-lg shadow-cyan-500/50" />
              )}

              {/* Efecto de brillo en hover */}
              <div
                className={cn(
                  "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                  "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 blur-sm"
                )}
              />

              <Icon
                className={cn(
                  "relative flex-shrink-0 z-10 transition-all duration-300",
                  active
                    ? "text-cyan-400 scale-110 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                    : "text-slate-400 group-hover:text-cyan-400 group-hover:scale-110",
                  isCollapsed ? "w-5 h-5" : "w-5 h-5"
                )}
              />
              {(!isCollapsed || isMobile) && (
                <span
                  className={cn(
                    "relative z-10 text-sm font-medium whitespace-nowrap transition-all duration-300",
                    active && "text-cyan-300"
                  )}
                >
                  {item.label}
                </span>
              )}

              {/* Tooltip cuando está colapsado - solo en desktop */}
              {isCollapsed && !isMobile && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-slate-200 text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 whitespace-nowrap border border-slate-700 shadow-xl z-50">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer del Sidebar */}
      {(!isCollapsed || isMobile) && (
        <div className="p-4 border-t border-slate-700/50">
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
            <p className="text-xs text-slate-400 text-center mb-1">
              Sistema de Gestión
            </p>
            <p className="text-xs font-semibold text-cyan-400 text-center">
              Fleet Management
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
