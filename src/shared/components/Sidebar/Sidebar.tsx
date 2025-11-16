import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
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

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        "relative h-screen bg-white border-r border-stone-200 transition-all duration-300 ease-in-out flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header del Sidebar */}
      <div className="flex items-center justify-between p-4 border-b border-stone-200">
        {!isCollapsed && (
          <h2 className="text-lg font-semibold text-stone-900">
            Fleet Monitor
          </h2>
        )}
        <button
          onClick={toggleSidebar}
          className={cn(
            "p-2 rounded-lg hover:bg-stone-100 transition-colors",
            isCollapsed && "mx-auto"
          )}
          aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-stone-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-stone-600" />
          )}
        </button>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                "hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2",
                active
                  ? "bg-amber-50 text-amber-700 font-medium shadow-sm"
                  : "text-stone-600 hover:text-stone-900",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  "flex-shrink-0",
                  active ? "text-amber-600" : "text-stone-500",
                  isCollapsed ? "w-6 h-6" : "w-5 h-5"
                )}
              />
              {!isCollapsed && (
                <span className="text-sm whitespace-nowrap">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer del Sidebar (opcional, para información adicional) */}
      {!isCollapsed && (
        <div className="p-4 border-t border-stone-200">
          <p className="text-xs text-stone-500 text-center">
            Sistema de Gestión de Flotas
          </p>
        </div>
      )}
    </aside>
  );
}
