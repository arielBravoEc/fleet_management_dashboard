import type { ReactNode } from "react";
import { Sidebar } from "../Sidebar/Sidebar";

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout principal de la aplicación
 * Incluye el Sidebar y el área de contenido principal
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-stone-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="h-full">{children}</div>
      </main>
    </div>
  );
}
