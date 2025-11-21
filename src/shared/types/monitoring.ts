/**
 * Tipos para el sistema de monitoreo de flotas
 */

export type AlertType =
  | "exceso_velocidad"
  | "detencion_no_autorizada"
  | "salida_ruta"
  | "perdida_senal";

export type AlertPriority = "alta" | "media" | "baja";

export interface Alert {
  id: string;
  type: AlertType;
  priority: AlertPriority;
  timestamp: Date;
  unitId: string;
  routeId: string;
  rideStart: Date;
  rideEnd: Date;
  details: {
    delay?: number; // minutos
    stopSkipped?: number;
    speed?: number; // km/h
    location?: {
      lat: number;
      lng: number;
    };
  };
  isRead: boolean;
}

export interface BusPosition {
  lat: number;
  lng: number;
  timestamp: Date;
}

export interface RouteSegment {
  lat: number;
  lng: number;
}

export interface BusRoute {
  id: string;
  routeId: string;
  unitId: string;
  routeName: string;
  completedSegments: RouteSegment[];
  remainingSegments: RouteSegment[];
  currentPosition: BusPosition;
  rideStart: Date;
  rideEnd: Date;
  delay: number; // minutos (negativo = adelantado, positivo = retrasado)
}
