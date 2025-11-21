/**
 * Generador de datos dummy para desarrollo
 */

import type {
  Alert,
  BusRoute,
  AlertType,
  AlertPriority,
} from "../types/monitoring";

// Coordenadas base para generar rutas (ejemplo: área urbana)
const BASE_LAT = -33.4489; // Santiago, Chile (puedes cambiar según necesidad)
const BASE_LNG = -70.6693;

/**
 * Genera una ruta aleatoria con segmentos completados y pendientes
 */
function generateRoute(routeId: string, unitId: string): BusRoute {
  const numSegments = 15 + Math.floor(Math.random() * 10);
  const completedRatio = 0.3 + Math.random() * 0.5; // 30-80% completado
  const completedCount = Math.floor(numSegments * completedRatio);

  // Generar segmentos de ruta
  const allSegments = Array.from({ length: numSegments }, (_, i) => {
    const angle = (i / numSegments) * Math.PI * 2;
    const radius = 0.01 + (i / numSegments) * 0.05;
    return {
      lat: BASE_LAT + Math.cos(angle) * radius + (Math.random() - 0.5) * 0.005,
      lng: BASE_LNG + Math.sin(angle) * radius + (Math.random() - 0.5) * 0.005,
    };
  });

  const completedSegments = allSegments.slice(0, completedCount);
  const remainingSegments = allSegments.slice(completedCount);

  // Posición actual (último segmento completado o próximo)
  const currentIndex = Math.min(completedCount, allSegments.length - 1);
  const currentPosition = {
    lat: allSegments[currentIndex].lat,
    lng: allSegments[currentIndex].lng,
    timestamp: new Date(),
  };

  // Generar horarios de viaje
  const now = new Date();
  const rideStart = new Date(now.getTime() - 20 * 60 * 1000); // 20 min atrás
  const rideEnd = new Date(now.getTime() + 15 * 60 * 1000); // 15 min adelante

  return {
    id: `route-${routeId}-${unitId}`,
    routeId,
    unitId,
    routeName: `Ruta ${routeId}`,
    completedSegments,
    remainingSegments,
    currentPosition,
    rideStart,
    rideEnd,
    delay: Math.floor((Math.random() - 0.5) * 10), // -5 a +5 minutos
  };
}

/**
 * Genera una alerta aleatoria
 */
function generateAlert(
  routeId: string,
  unitId: string,
  rideStart: Date,
  rideEnd: Date
): Alert {
  const alertTypes: AlertType[] = [
    "exceso_velocidad",
    "detencion_no_autorizada",
    "salida_ruta",
    "perdida_senal",
  ];

  const priorities: Array<AlertPriority> = ["alta", "media", "baja"];

  const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
  const priority = priorities[Math.floor(Math.random() * priorities.length)];

  // Generar detalles según el tipo
  const details: Alert["details"] = {
    location: {
      lat: BASE_LAT + (Math.random() - 0.5) * 0.1,
      lng: BASE_LNG + (Math.random() - 0.5) * 0.1,
    },
  };

  if (type === "exceso_velocidad") {
    details.speed = 60 + Math.floor(Math.random() * 40); // 60-100 km/h
  } else if (type === "detencion_no_autorizada") {
    // Sin detalles adicionales
  } else if (type === "salida_ruta") {
    // Sin detalles adicionales
  } else if (type === "perdida_senal") {
    // Sin detalles adicionales
  }

  // Algunas alertas tienen delay o stop skipped
  if (Math.random() > 0.5) {
    details.delay = Math.floor((Math.random() - 0.5) * 10);
  }
  if (Math.random() > 0.6) {
    details.stopSkipped = Math.floor(Math.random() * 3) + 1;
  }

  return {
    id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    priority,
    timestamp: new Date(Date.now() - Math.random() * 30 * 60 * 1000), // Últimos 30 min
    unitId,
    routeId,
    rideStart,
    rideEnd,
    details,
    isRead: Math.random() > 0.7, // 30% leídas
  };
}

/**
 * Genera datos dummy completos
 */
export function generateDummyData() {
  const routes: BusRoute[] = [];
  const alerts: Alert[] = [];

  // Generar 5-8 buses en diferentes rutas
  const numBuses = 5 + Math.floor(Math.random() * 4);
  const routeIds = ["13g", "5a", "7b", "12c", "9d"];

  for (let i = 0; i < numBuses; i++) {
    const routeId = routeIds[i % routeIds.length];
    const unitId = `Bus ${i + 1}`;

    const route = generateRoute(routeId, unitId);
    routes.push(route);

    // Generar 2-4 alertas por bus
    const numAlerts = 2 + Math.floor(Math.random() * 3);
    for (let j = 0; j < numAlerts; j++) {
      const alert = generateAlert(
        routeId,
        unitId,
        route.rideStart,
        route.rideEnd
      );
      alerts.push(alert);
    }
  }

  // Ordenar alertas por timestamp (más recientes primero)
  alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return { routes, alerts };
}
