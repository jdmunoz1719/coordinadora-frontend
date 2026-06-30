import {
  Activity,
  AlertTriangle,
  BellRing,
  LayoutDashboard,
} from "lucide-react";
import { memo } from "react";

export type TabId = "resumen" | "incidentes" | "alertas" | "eventos";

const TABS = [
  { id: "resumen" as TabId, label: "Resumen", Icon: LayoutDashboard },
  { id: "incidentes" as TabId, label: "Incidentes", Icon: AlertTriangle },
  { id: "alertas" as TabId, label: "Alertas", Icon: BellRing },
  { id: "eventos" as TabId, label: "Eventos", Icon: Activity },
] as const;

interface TabBarProps {
  active: TabId;
  counts: Record<TabId, number>;
  onSelect: (id: TabId) => void;
}

export const TabBar = memo(function TabBar({
  active,
  counts,
  onSelect,
}: TabBarProps) {
  return (
    <div className="border-b border-slate-200 bg-white px-4 sm:px-6">
      <nav className="-mb-px flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" aria-label="Tabs">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          const count = counts[id];
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`group flex shrink-0 items-center gap-2 border-b-2 px-4 py-3.5 text-sm font-medium transition-colors focus:outline-none sm:px-5 ${
                isActive
                  ? "border-brand-600 text-brand-600"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
              }`}
            >
              <Icon size={15} className="shrink-0" />
              {label}
              {count > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold tabular-nums transition-colors ${
                    isActive
                      ? "bg-brand-100 text-brand-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
});
