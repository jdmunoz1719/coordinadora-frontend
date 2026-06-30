import { Clock, ShieldAlert } from "lucide-react";
import { memo } from "react";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  lastUpdated?: string | null;
  wsConnected?: boolean;
}

export const Header = memo(function Header({
  title = "Dashboard Operacional",
  subtitle = "Visión en tiempo real de incidentes, alertas y eventos",
  lastUpdated,
  wsConnected = false,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600">
          <ShieldAlert size={18} className="text-white" />
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-bold text-slate-900">{title}</h1>
          <p className="hidden truncate text-xs text-slate-500 sm:block">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${wsConnected ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
          >
            <span className="relative flex h-2 w-2">
              {wsConnected && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${wsConnected ? "bg-emerald-500" : "bg-slate-400"}`}
              />
            </span>
            {wsConnected ? "En vivo" : "Desconectado"}
          </div>

          {lastUpdated && (
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
              <Clock size={13} />
              {new Date(lastUpdated).toLocaleTimeString("es-ES")}
            </div>
          )}
        </div>
      </div>
    </header>
  );
});
