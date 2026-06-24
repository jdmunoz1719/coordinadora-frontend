import { Button } from "@/shared/components/Button";
import { FloatingRefreshButton } from "@shared/components/FloatingRefreshButton";
import {
  selectAlerts,
  selectError,
  selectEventsByApplication,
  selectEventsBySeverity,
  selectIncidents,
  selectLastUpdated,
  selectMetrics,
  useDashboardStore,
} from "@store/dashboardStore";
import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
  FolderOpen,
  RefreshCw
} from "lucide-react";
import { useCallback } from "react";
import { AlertFilters, AlertsTable } from "../components/AlertsTab";
import { EventsByApplicationChart, EventsBySeverityChart } from "../components/ResumenTab";
import { EventsFilters, EventsTable } from "../components/EventsTab";
import { Header } from "../components/Header";
import { IncidentsFilters, IncidentsTable } from "../components/IncidentsTab";
import { MetricsCard } from "../components/MetricsCard";
import { TabBar } from "../components/TabBar";
import { useTabManager } from "../hooks/useTabManager";

export function DashboardPage() {
  const {
    activeTab,
    switchTab,
    isLoading,
    wsConnected,
    counts,
    pagination,
    onPageChange,
    onLimitChange,
    alertFilters,
    onAlertFiltersChange,
    incidentFilters,
    onIncidentFiltersChange,
    eventFilters,
    onEventFiltersChange,
    refresh,
  } = useTabManager();

  const incidents = useDashboardStore(selectIncidents);
  const alerts = useDashboardStore(selectAlerts);
  const events = useDashboardStore((s) => s.events || []);
  const metrics = useDashboardStore(selectMetrics);
  const eventsByApplication = useDashboardStore(selectEventsByApplication);
  const eventsBySeverity = useDashboardStore(selectEventsBySeverity);
  const error = useDashboardStore(selectError);
  const lastUpdated = useDashboardStore(selectLastUpdated);

  const handleRefresh = useCallback(async () => await refresh(), [refresh]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <Header lastUpdated={lastUpdated} wsConnected={wsConnected} />

      <TabBar active={activeTab} counts={counts} onSelect={switchTab} />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
            <AlertTriangle size={20} className="shrink-0 text-red-600" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-red-800">
                Error al cargar datos
              </p>
              <p className="text-sm text-red-600 truncate">{error}</p>
            </div>
            <Button
              variant="danger"
              size="sm"
              icon={<RefreshCw size={14} />}
              onClick={handleRefresh}
            >
              Reintentar
            </Button>
          </div>
        )}

        {activeTab === "resumen" && (
          <>
            <FloatingRefreshButton
              onClick={handleRefresh}
              isLoading={isLoading}
            />
            {metrics ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricsCard
                  label="Incidentes Abiertos"
                  value={metrics.totalOpenIncidents}
                  icon={<FolderOpen size={22} />}
                  color="red"
                />
                <MetricsCard
                  label="Incidentes Resueltos"
                  value={metrics.totalResolvedIncidents}
                  icon={<CheckCircle2 size={22} />}
                  color="green"
                />
                <MetricsCard
                  label="Alertas Generadas"
                  value={metrics.totalAlerts}
                  icon={<BellRing size={22} />}
                  color="blue"
                />
              </div>
            ) : isLoading ? null : null}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <EventsByApplicationChart
                data={eventsByApplication}
                isLoading={isLoading}
              />
              <EventsBySeverityChart
                data={eventsBySeverity}
                isLoading={isLoading}
              />
            </div>
          </>
        )}

        {activeTab === "incidentes" && (
          <>
            <FloatingRefreshButton
              onClick={handleRefresh}
              isLoading={isLoading}
            />
            <IncidentsFilters
              filters={incidentFilters}
              onFilterChange={onIncidentFiltersChange}
            />
            <IncidentsTable
              incidents={incidents}
              isLoading={isLoading}
              page={pagination.page}
              limit={pagination.limit}
              total={pagination.total}
              onPageChange={onPageChange}
              onLimitChange={onLimitChange}
            />
          </>
        )}

        {activeTab === "alertas" && (
          <>
            <FloatingRefreshButton
              onClick={handleRefresh}
              isLoading={isLoading}
            />
            <AlertFilters
              filters={alertFilters}
              onFilterChange={onAlertFiltersChange}
            />
            <AlertsTable
              alerts={alerts}
              isLoading={isLoading}
              page={pagination.page}
              limit={pagination.limit}
              total={pagination.total}
              onPageChange={onPageChange}
              onLimitChange={onLimitChange}
            />
          </>
        )}

        {activeTab === "eventos" && (
          <>
            <FloatingRefreshButton
              onClick={handleRefresh}
              isLoading={isLoading}
            />
            <EventsFilters
              filters={eventFilters}
              onFilterChange={onEventFiltersChange}
            />
            <EventsTable
              events={events}
              isLoading={isLoading}
              page={pagination.page}
              limit={pagination.limit}
              total={pagination.total}
              onPageChange={onPageChange}
              onLimitChange={onLimitChange}
            />
          </>
        )}
      </main>
    </div>
  );
}
