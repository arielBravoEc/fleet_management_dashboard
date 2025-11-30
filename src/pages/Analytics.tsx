import { useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart2,
  Bell,
  BusFront,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { generateDummyData } from "../shared/utils/dummyData";
import type { Alert } from "../shared/types/monitoring";
import {
  AlertsByTypeDonut,
  ChartCard,
  KpiCard,
} from "../shared/components/Analytics";
import type { AlertsByTypeDatum } from "../shared/components/Analytics/AlertsByTypeDonut";

type AlertsOverTimeDatum = {
  label: string;
  total: number;
  high: number;
};

type MonthlyComparison = {
  current: number;
  previous: number;
  changePct: number;
  isIncrease: boolean;
};

const ALERT_TYPE_LABELS: Record<string, string> = {
  exceso_velocidad: "Exceso de velocidad",
  detencion_no_autorizada: "Detención no autorizada",
  salida_ruta: "Salida de ruta",
  perdida_senal: "Pérdida de señal",
};

const ALERT_TYPE_COLORS: Record<string, string> = {
  exceso_velocidad: "#f97373", // red-400
  detencion_no_autorizada: "#fb923c", // orange-400
  salida_ruta: "#facc15", // yellow-400
  perdida_senal: "#a855f7", // purple-500
};

function buildAlertsByType(alerts: Alert[]): AlertsByTypeDatum[] {
  const counts: Record<string, number> = {};

  alerts.forEach((alert) => {
    counts[alert.type] = (counts[alert.type] ?? 0) + 1;
  });

  return Object.entries(counts).map(([type, value]) => ({
    type,
    label: ALERT_TYPE_LABELS[type] ?? type,
    value,
  }));
}

function buildAlertsOverTime(alerts: Alert[]): AlertsOverTimeDatum[] {
  if (!alerts.length) return [];

  // Agrupamos por bloques de 5 minutos en la última hora
  const now = new Date();
  const buckets: Record<string, AlertsOverTimeDatum> = {};

  alerts.forEach((alert) => {
    const diffMs = now.getTime() - alert.timestamp.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    // Nos quedamos con las últimas 60 min aprox.
    if (diffMinutes < 0 || diffMinutes > 60) return;

    const bucketIndex = Math.floor(diffMinutes / 5);
    const label = `${String((now.getHours() + 24) % 24).padStart(
      2,
      "0"
    )}:${String(Math.max(0, now.getMinutes() - bucketIndex * 5)).padStart(
      2,
      "0"
    )}`;

    if (!buckets[label]) {
      buckets[label] = { label, total: 0, high: 0 };
    }

    buckets[label].total += 1;
    if (alert.priority === "alta") {
      buckets[label].high += 1;
    }
  });

  return Object.values(buckets)
    .sort((a, b) => (a.label < b.label ? -1 : 1))
    .reverse();
}

function buildMonthlyComparison(alerts: Alert[]): MonthlyComparison {
  // Simulamos dos meses usando el volumen actual de alertas
  const base = alerts.length;
  const current = Math.max(0, Math.round(base * 1.4));
  const previous = Math.max(0, Math.round(base * 1.2));

  if (previous === 0) {
    return {
      current,
      previous,
      changePct: 0,
      isIncrease: true,
    };
  }

  const changePct = ((current - previous) / previous) * 100;

  return {
    current,
    previous,
    changePct,
    isIncrease: changePct >= 0,
  };
}

export default function AnalyticsPage() {
  const { routes, alerts } = useMemo(() => generateDummyData(), []);

  const totalBuses = routes.length;
  const unitsWithAlerts = useMemo(
    () => new Set(alerts.map((a) => a.unitId)).size,
    [alerts]
  );
  const unitsWithoutAlerts = Math.max(0, totalBuses - unitsWithAlerts);

  const unresolvedAlerts = alerts.filter((a) => !a.isRead);

  const alertsByType = useMemo(() => buildAlertsByType(alerts), [alerts]);

  const alertsOverTime = useMemo(() => buildAlertsOverTime(alerts), [alerts]);

  const monthlyComparison = useMemo(
    () => buildMonthlyComparison(alerts),
    [alerts]
  );

  return (
    <div className="h-full p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6 md:space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl">
              Analytics
            </h1>
            <p className="mt-1 text-sm text-slate-400 sm:text-base">
              Monitoreo de alertas, flota y tendencias operacionales en tiempo
              casi real.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/80 px-3 py-1 text-xs text-slate-300 sm:px-4 sm:text-sm">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.9)]" />
            Motor inteligente de alertas activo (modo demo)
          </div>
        </div>

        {/* KPIs principales */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            icon={<BusFront className="h-5 w-5" />}
            label="Buses monitoreados"
            value={totalBuses.toString()}
            subtitle="Unidades con telemetría activa"
          />
          <KpiCard
            icon={<Activity className="h-5 w-5" />}
            label="Buses sin alertas"
            value={unitsWithoutAlerts.toString()}
            subtitle="Operación dentro de parámetros"
            trend={
              unitsWithoutAlerts >= unitsWithAlerts
                ? "Mayoría sin incidentes"
                : "Alta proporción con incidentes"
            }
            trendPositive={unitsWithoutAlerts >= unitsWithAlerts}
          />
          <KpiCard
            icon={<Bell className="h-5 w-5" />}
            label="Alertas activas"
            value={unresolvedAlerts.length.toString()}
            subtitle={`${alerts.length} alertas totales generadas en la ventana actual`}
          />
          <KpiCard
            icon={<BarChart2 className="h-5 w-5" />}
            label="Variación mensual estimada"
            value={`${monthlyComparison.changePct >= 0 ? "+" : ""}${monthlyComparison.changePct.toFixed(1)}%`}
            subtitle={`Mes actual: ${monthlyComparison.current.toLocaleString()} vs. mes previo: ${monthlyComparison.previous.toLocaleString()} alertas`}
            trend={
              monthlyComparison.isIncrease
                ? "Mayor sensibilidad del sistema"
                : "Menos alertas que el mes previo"
            }
            trendPositive={!monthlyComparison.isIncrease}
          />
        </section>

        {/* Gráficos principales */}
        <section className="grid gap-4 lg:grid-cols-3">
          {/* Alertas en el tiempo */}
          <div className="lg:col-span-2">
            <ChartCard
              title="Alertas a lo largo del tiempo"
              description="Distribución temporal de alertas totales y de alta prioridad en la última hora simulada."
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={alertsOverTime}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    tickMargin={8}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      borderColor: "#1e293b",
                      borderRadius: 12,
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Alertas totales"
                    stroke="#22d3ee"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="high"
                    name="Alta prioridad"
                    stroke="#fb7185"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Distribución por tipo */}
          <div>
            <ChartCard
              title="Distribución por tipo de alerta"
              description="Mix actual de severidad operacional según la clasificación del modelo."
            >
              <AlertsByTypeDonut
                data={alertsByType}
                colors={ALERT_TYPE_COLORS}
              />
            </ChartCard>
          </div>
        </section>

        {/* Alertas por prioridad / estado */}
        <section className="grid gap-4 lg:grid-cols-2">
          <ChartCard
            title="Alertas por prioridad"
            description="Carga actual del operador según el nivel de criticidad."
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    name: "Alta",
                    total: alerts.filter((a) => a.priority === "alta").length,
                    activas: unresolvedAlerts.filter(
                      (a) => a.priority === "alta"
                    ).length,
                  },
                  {
                    name: "Media",
                    total: alerts.filter((a) => a.priority === "media").length,
                    activas: unresolvedAlerts.filter(
                      (a) => a.priority === "media"
                    ).length,
                  },
                  {
                    name: "Baja",
                    total: alerts.filter((a) => a.priority === "baja").length,
                    activas: unresolvedAlerts.filter(
                      (a) => a.priority === "baja"
                    ).length,
                  },
                ]}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  tickMargin={8}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    borderColor: "#1e293b",
                    borderRadius: 12,
                  }}
                  labelStyle={{ color: "#e2e8f0" }}
                />
                <Legend />
                <Bar
                  dataKey="total"
                  name="Total generadas"
                  stackId="a"
                  fill="#22d3ee"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="activas"
                  name="Sin resolver"
                  stackId="a"
                  fill="#fb7185"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="space-y-3 rounded-xl border border-slate-700/60 bg-slate-900/70 p-4 sm:p-5 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-100 sm:text-base">
                  Resumen operativo rápido
                </h3>
                <p className="text-xs text-slate-400 sm:text-sm">
                  Estado sintético de la flota según el motor híbrido (Isolation
                  Forest + Random Forest).
                </p>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-slate-300 sm:text-sm">
              <li className="flex items-center justify-between gap-3 rounded-lg bg-slate-900/80 px-3 py-2">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Buses sin incidentes críticos
                </span>
                <span className="font-semibold text-emerald-400">
                  {unitsWithoutAlerts}/{totalBuses}
                </span>
              </li>
              <li className="flex items-center justify-between gap-3 rounded-lg bg-slate-900/80 px-3 py-2">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-400" />
                  Buses con al menos una alerta
                </span>
                <span className="font-semibold text-yellow-300">
                  {unitsWithAlerts}
                </span>
              </li>
              <li className="flex items-center justify-between gap-3 rounded-lg bg-slate-900/80 px-3 py-2">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  Alertas de alta prioridad sin resolver
                </span>
                <span className="font-semibold text-red-400">
                  {unresolvedAlerts.filter((a) => a.priority === "alta").length}
                </span>
              </li>
            </ul>

            <p className="text-xs text-slate-500">
              Esta vista utiliza datos dummy generados localmente como
              aproximación a las salidas del pipeline de detección (Isolation
              Forest) y priorización contextual (Random Forest). Todo este panel
              se debe conectar con la API real.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
