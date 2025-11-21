import { useState, useEffect } from "react";
import { FleetMap } from "@/shared/components/Map";
import { AlertPanel } from "@/shared/components/AlertPanel";
import { generateDummyData } from "@/shared/utils/dummyData";
import type { Alert, BusRoute } from "@/shared/types/monitoring";

export default function HomePage() {
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  // Cargar datos dummy al montar el componente
  useEffect(() => {
    const { routes: dummyRoutes, alerts: dummyAlerts } = generateDummyData();
    setRoutes(dummyRoutes);
    setAlerts(dummyAlerts);
  }, []);

  // Simular actualización de datos cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const { routes: dummyRoutes, alerts: dummyAlerts } = generateDummyData();
      setRoutes(dummyRoutes);
      setAlerts(dummyAlerts);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlertId(alert.id);

    // Encontrar la ruta asociada a esta alerta
    // Buscar primero por coincidencia exacta de unitId y routeId
    let relatedRoute = routes.find(
      (r) => r.unitId === alert.unitId && r.routeId === alert.routeId
    );

    // Si no se encuentra, buscar solo por unitId
    if (!relatedRoute) {
      relatedRoute = routes.find((r) => r.unitId === alert.unitId);
    }

    // Si aún no se encuentra, buscar solo por routeId
    if (!relatedRoute) {
      relatedRoute = routes.find((r) => r.routeId === alert.routeId);
    }

    if (relatedRoute) {
      setSelectedRouteId(relatedRoute.id);
    }
  };

  const handleMarkAsRead = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const handleDelete = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
    if (selectedAlertId === alertId) {
      setSelectedAlertId(null);
    }
  };

  const handleMarkAllAsRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, isRead: true })));
  };

  const handleDeleteAll = () => {
    setAlerts([]);
    setSelectedAlertId(null);
  };

  const handleBusClick = (route: BusRoute) => {
    setSelectedRouteId(route.id);
    // Encontrar alertas relacionadas con este bus
    const relatedAlerts = alerts.filter(
      (a) => a.unitId === route.unitId && a.routeId === route.routeId
    );
    if (relatedAlerts.length > 0) {
      setSelectedAlertId(relatedAlerts[0].id);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 md:p-8 lg:overflow-hidden">
      {/* Header */}
      <div className="mb-4 md:mb-6 flex-shrink-0">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
          Dashboard de Monitoreo de Flotas
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Sistema inteligente de gestión de alertas con Machine Learning
        </p>
      </div>

      {/* Contenido principal: Mapa y Panel de Alertas */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:min-h-0 lg:overflow-hidden">
        {/* Mapa - Ocupa 2/3 del ancho en pantallas grandes */}
        <div className="lg:col-span-2 h-[500px] lg:h-full lg:min-h-0">
          <FleetMap
            routes={routes}
            alerts={alerts}
            selectedAlertId={selectedAlertId}
            selectedRouteId={selectedRouteId}
            onBusClick={handleBusClick}
          />
        </div>

        {/* Panel de Alertas - Ocupa 1/3 del ancho en pantallas grandes */}
        <div className="lg:h-full lg:min-h-0">
          <AlertPanel
            alerts={alerts}
            selectedAlertId={selectedAlertId}
            onAlertClick={handleAlertClick}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDelete}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDeleteAll={handleDeleteAll}
          />
        </div>
      </div>
    </div>
  );
}
