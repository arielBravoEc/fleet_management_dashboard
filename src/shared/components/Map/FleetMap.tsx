import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
//import type { Map as LeafletMap } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { BusRoute, Alert } from "../../types/monitoring";
import { Bus } from "lucide-react";

// Fix para iconos de Leaflet en React
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Paleta de colores para las rutas (colores distintivos y visibles)
const ROUTE_COLORS = [
  "#3b82f6", // Azul
  "#22c55e", // Verde
  "#f59e0b", // Naranja
  "#ef4444", // Rojo
  "#a855f7", // Púrpura
  "#06b6d4", // Cyan
  "#f97316", // Naranja oscuro
  "#10b981", // Verde esmeralda
  "#8b5cf6", // Violeta
  "#ec4899", // Rosa
  "#14b8a6", // Turquesa
  "#fbbf24", // Amarillo
];

/**
 * Obtiene un color único para una ruta basado en su ID
 */
const getRouteColor = (routeId: string): string => {
  // Usar el hash del routeId para obtener un índice consistente
  let hash = 0;
  for (let i = 0; i < routeId.length; i++) {
    hash = routeId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % ROUTE_COLORS.length;
  return ROUTE_COLORS[index];
};

/**
 * Genera una versión más clara del color para la ruta pendiente
 */
const getLighterColor = (color: string): string => {
  // Convertir hex a RGB
  const hex = color.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Mezclar con blanco para hacerlo más claro (70% color original, 30% blanco)
  const lightR = Math.round(r * 0.7 + 255 * 0.3);
  const lightG = Math.round(g * 0.7 + 255 * 0.3);
  const lightB = Math.round(b * 0.7 + 255 * 0.3);

  return `rgb(${lightR}, ${lightG}, ${lightB})`;
};

// Icono personalizado para buses
const createBusIcon = (hasAlerts: boolean) => {
  // Verde si no tiene alertas, rojo si tiene alertas
  const color = hasAlerts ? "#ef4444" : "#22c55e";
  return L.divIcon({
    className: "custom-bus-icon",
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 16c0 .88.39 1.67 1 2.22V20a1 1 0 001 1h1a1 1 0 001-1v-1h8v1a1 1 0 001 1h1a1 1 0 001-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

interface FleetMapProps {
  routes: BusRoute[];
  alerts?: Alert[];
  selectedAlertId?: string | null;
  selectedRouteId?: string | null;
  onBusClick?: (route: BusRoute) => void;
}

// Componente interno para controlar el mapa
function MapController({
  routes,
  selectedRouteId,
}: {
  routes: BusRoute[];
  selectedRouteId?: string | null;
}) {
  const map = useMap();
  const [hasInitialized, setHasInitialized] = useState(false);

  // Ajustar vista inicial cuando se cargan las rutas
  useEffect(() => {
    if (routes.length > 0 && !hasInitialized && !selectedRouteId) {
      const bounds = L.latLngBounds(
        routes.flatMap((route) => [
          ...route.completedSegments,
          ...route.remainingSegments,
          route.currentPosition,
        ])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
      setHasInitialized(true);
    }
  }, [routes, map, selectedRouteId, hasInitialized]);

  // Centrar en ruta seleccionada con animación suave
  useEffect(() => {
    if (selectedRouteId && routes.length > 0) {
      const selectedRoute = routes.find((r) => r.id === selectedRouteId);
      if (selectedRoute) {
        // Asegurar que el mapa esté listo antes de centrar
        map.whenReady(() => {
          map.flyTo(
            [
              selectedRoute.currentPosition.lat,
              selectedRoute.currentPosition.lng,
            ],
            15,
            {
              duration: 1.0, // Duración de la animación en segundos
              easeLinearity: 0.25,
            }
          );
        });
      }
    }
  }, [selectedRouteId, routes, map]);

  return null;
}

export function FleetMap({
  routes,
  alerts = [],
  selectedRouteId,
  onBusClick,
}: FleetMapProps) {
  // Crear un Set de claves (unitId-routeId) para buses con alertas
  const busesWithAlerts = new Set(
    alerts.map((alert) => `${alert.unitId}-${alert.routeId}`)
  );

  // Función para verificar si un bus tiene alertas
  const hasAlertsForBus = (route: BusRoute) => {
    return busesWithAlerts.has(`${route.unitId}-${route.routeId}`);
  };

  if (routes.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900/50 rounded-lg">
        <p className="text-slate-400">No hay rutas disponibles</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-slate-700/50">
      <MapContainer
        center={[
          routes[0]?.currentPosition.lat || -33.4489,
          routes[0]?.currentPosition.lng || -70.6693,
        ]}
        zoom={13}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        className="leaflet-container-dark"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController routes={routes} selectedRouteId={selectedRouteId} />

        {routes.map((route) => {
          const allSegments = [
            ...route.completedSegments,
            ...route.remainingSegments,
          ];

          // Obtener color único para esta ruta
          const routeColor = getRouteColor(route.routeId);
          const lighterColor = getLighterColor(routeColor);

          return (
            <div key={route.id}>
              {/* Ruta completa (gris claro) */}
              {allSegments.length > 1 && (
                <Polyline
                  positions={allSegments.map((s) => [s.lat, s.lng])}
                  color="#64748b"
                  weight={2}
                  opacity={0.3}
                />
              )}

              {/* Ruta completada (color único de la ruta) */}
              {route.completedSegments.length > 1 && (
                <Polyline
                  positions={route.completedSegments.map((s) => [s.lat, s.lng])}
                  color={routeColor}
                  weight={4}
                  opacity={0.9}
                />
              )}

              {/* Ruta pendiente (versión más clara del color de la ruta) */}
              {route.remainingSegments.length > 1 && (
                <Polyline
                  positions={route.remainingSegments.map((s) => [s.lat, s.lng])}
                  color={lighterColor}
                  weight={3}
                  opacity={0.7}
                  dashArray="10, 5"
                />
              )}

              {/* Marcador del bus */}
              <Marker
                position={[
                  route.currentPosition.lat,
                  route.currentPosition.lng,
                ]}
                icon={createBusIcon(hasAlertsForBus(route))}
                eventHandlers={{
                  click: () => onBusClick?.(route),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <Bus className="w-4 h-4 text-cyan-400" />
                      <span className="font-semibold text-slate-900">
                        {route.unitId}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-slate-700">
                      <p>
                        <span className="font-medium">Ruta:</span>{" "}
                        {route.routeName}
                      </p>
                      <p>
                        <span className="font-medium">Viaje:</span>{" "}
                        {route.rideStart.toLocaleTimeString("es-CL", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        –{" "}
                        {route.rideEnd.toLocaleTimeString("es-CL", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p>
                        <span className="font-medium">Retraso:</span>{" "}
                        <span
                          className={
                            route.delay > 0
                              ? "text-red-600"
                              : route.delay < 0
                                ? "text-green-600"
                                : "text-slate-600"
                          }
                        >
                          {route.delay > 0 ? "+" : ""}
                          {route.delay} min
                        </span>
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        {route.currentPosition.timestamp.toLocaleTimeString(
                          "es-CL"
                        )}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </div>
          );
        })}
      </MapContainer>

      <style>{`
        .leaflet-container-dark {
          background-color: #1e293b;
        }
        .leaflet-container-dark .leaflet-tile {
          filter: brightness(0.6) contrast(1.2) saturate(1.2);
        }
        .custom-bus-icon {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
}
