import type { ReactNode } from "react";

export interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-700/60 bg-slate-900/70 p-4 sm:p-5 shadow-lg">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 sm:text-base">
            {title}
          </h3>
          {description && (
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="relative mt-1 flex-1">
        <div className="pointer-events-none absolute inset-px rounded-xl bg-gradient-to-br from-slate-50/5 via-transparent to-cyan-500/5" />
        <div className="relative h-56 sm:h-64 md:h-72">{children}</div>
      </div>
    </div>
  );
}
