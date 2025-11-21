import { useState } from "react";
import {
  AlertTriangle,
  Zap,
  MapPin,
  WifiOff,
  Clock,
  Trash2,
  Check,
  ChevronRight,
} from "lucide-react";
import type { Alert, AlertType } from "../../types/monitoring";
import { format } from "date-fns";

interface AlertPanelProps {
  alerts: Alert[];
  selectedAlertId?: string | null;
  onAlertClick?: (alert: Alert) => void;
  onMarkAsRead?: (alertId: string) => void;
  onDelete?: (alertId: string) => void;
  onMarkAllAsRead?: () => void;
  onDeleteAll?: () => void;
}

const alertTypeConfig: Record<
  AlertType,
  { label: string; icon: typeof AlertTriangle; color: string }
> = {
  exceso_velocidad: {
    label: "Exceso de Velocidad",
    icon: Zap,
    color: "text-red-400",
  },
  detencion_no_autorizada: {
    label: "Detención No Autorizada",
    icon: MapPin,
    color: "text-orange-400",
  },
  salida_ruta: {
    label: "Salida de Ruta",
    icon: AlertTriangle,
    color: "text-yellow-400",
  },
  perdida_senal: {
    label: "Pérdida de Señal",
    icon: WifiOff,
    color: "text-purple-400",
  },
};

const priorityColors: Record<string, string> = {
  alta: "border-l-red-500 bg-red-500/10",
  media: "border-l-yellow-500 bg-yellow-500/10",
  baja: "border-l-blue-500 bg-blue-500/10",
};

export function AlertPanel({
  alerts,
  selectedAlertId,
  onAlertClick,
  onMarkAsRead,
  onDelete,
  onMarkAllAsRead,
  onDeleteAll,
}: AlertPanelProps) {
  const [hoveredAlertId, setHoveredAlertId] = useState<string | null>(null);

  const formatTime = (date: Date) => {
    return format(date, "HH:mm:ss");
  };

  const formatRideTime = (start: Date, end: Date) => {
    return `${format(start, "HH:mm")} - ${format(end, "HH:mm")}`;
  };

  const getAlertDetails = (alert: Alert) => {
    const details: string[] = [];
    if (alert.details.delay !== undefined) {
      const delayText =
        alert.details.delay > 0
          ? `+${alert.details.delay} min`
          : `${alert.details.delay} min`;
      details.push(`Retraso: ${delayText}`);
    }
    if (alert.details.stopSkipped) {
      details.push(`Parada omitida: ${alert.details.stopSkipped}`);
    }
    if (alert.details.speed) {
      details.push(`Velocidad: ${alert.details.speed} km/h`);
    }
    return details.join(", ");
  };

  return (
    <div className="lg:h-full flex flex-col bg-slate-900/50 backdrop-blur-xl rounded-lg border border-slate-700/50 lg:overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700/50">
        <h2 className="text-lg font-semibold text-slate-200 mb-1">
          Panel de Alertas
        </h2>
        <p className="text-sm text-slate-400">
          {alerts.length} alerta{alerts.length !== 1 ? "s" : ""} total
          {alerts.filter((a) => !a.isRead).length > 0 && (
            <span className="ml-2 text-cyan-400">
              ({alerts.filter((a) => !a.isRead).length} sin leer)
            </span>
          )}
        </p>
      </div>

      {/* Lista de alertas */}
      <div className="lg:flex-1 overflow-y-visible lg:overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay alertas disponibles</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/50">
            {alerts.map((alert) => {
              const config = alertTypeConfig[alert.type];
              const Icon = config.icon;
              const isSelected = selectedAlertId === alert.id;
              const isHovered = hoveredAlertId === alert.id;

              return (
                <div
                  key={alert.id}
                  className={`
                    relative p-4 border-l-4 transition-all duration-200 cursor-pointer
                    ${priorityColors[alert.priority]}
                    ${isSelected ? "ring-2 ring-cyan-500/50" : ""}
                    ${!alert.isRead ? "opacity-100" : "opacity-70"}
                    hover:bg-slate-800/50
                  `}
                  onMouseEnter={() => setHoveredAlertId(alert.id)}
                  onMouseLeave={() => setHoveredAlertId(null)}
                  onClick={() => onAlertClick?.(alert)}
                >
                  <div className="flex items-start gap-3">
                    {/* Icono */}
                    <div
                      className={`flex-shrink-0 mt-0.5 ${config.color} ${
                        !alert.isRead ? "" : "opacity-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-200">
                            {config.label}
                            {alert.details.stopSkipped && (
                              <span className="ml-2 text-xs text-slate-400">
                                Parada omitida: {alert.details.stopSkipped}
                              </span>
                            )}
                          </p>
                          {alert.details.delay !== undefined && (
                            <p className="text-xs text-slate-300 mt-0.5">
                              Retraso:{" "}
                              <span
                                className={
                                  alert.details.delay > 0
                                    ? "text-red-400"
                                    : alert.details.delay < 0
                                      ? "text-green-400"
                                      : "text-slate-400"
                                }
                              >
                                {alert.details.delay > 0 ? "+" : ""}
                                {alert.details.delay} min
                              </span>
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {!alert.isRead && (
                            <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                          )}
                          <ChevronRight
                            className={`w-4 h-4 text-slate-400 transition-transform ${
                              isHovered ? "translate-x-1" : ""
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(alert.timestamp)}</span>
                      </div>

                      <div className="space-y-1 text-xs text-slate-400">
                        <p>
                          <span className="font-medium">Unidad:</span>{" "}
                          {alert.unitId}
                        </p>
                        <p>
                          <span className="font-medium">Ruta:</span>{" "}
                          {alert.routeId}
                        </p>
                        <p>
                          <span className="font-medium">Viaje:</span>{" "}
                          {formatRideTime(alert.rideStart, alert.rideEnd)}
                        </p>
                        {getAlertDetails(alert) && (
                          <p className="text-slate-500 mt-1">
                            {getAlertDetails(alert)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Acciones */}
                    {(isHovered || isSelected) && (
                      <div className="flex items-center gap-1 ml-2">
                        {!alert.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkAsRead?.(alert.id);
                            }}
                            className="p-1.5 rounded hover:bg-slate-700/50 text-slate-400 hover:text-green-400 transition-colors"
                            title="Marcar como leída"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(alert.id);
                          }}
                          className="p-1.5 rounded hover:bg-slate-700/50 text-slate-400 hover:text-red-400 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer con acciones */}
      {alerts.length > 0 && (
        <div className="p-3 border-t border-slate-700/50 flex items-center justify-between text-sm">
          <button
            onClick={onMarkAllAsRead}
            className="text-slate-400 hover:text-cyan-400 transition-colors px-2 py-1 rounded hover:bg-slate-800/50"
          >
            Marcar todas como leídas
          </button>
          <button
            onClick={onDeleteAll}
            className="text-slate-400 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-slate-800/50"
          >
            Eliminar todas
          </button>
        </div>
      )}
    </div>
  );
}
