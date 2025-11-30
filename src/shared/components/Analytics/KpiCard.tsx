import type { ReactNode } from "react";

export interface KpiCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  subtitle?: string;
  trend?: string;
  trendPositive?: boolean;
}

export function KpiCard({
  icon,
  label,
  value,
  subtitle,
  trend,
  trendPositive,
}: KpiCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/70 p-4 sm:p-5 shadow-lg">
      <div className="pointer-events-none absolute inset-px rounded-xl bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-50 sm:text-3xl">
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">{subtitle}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800/80 text-cyan-400 shadow-inner shadow-slate-900 sm:h-10 sm:w-10">
            {icon}
          </div>
          {trend && (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                trendPositive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
