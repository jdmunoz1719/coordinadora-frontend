import {
  selectError,
  selectLastUpdated,
  useDashboardStore,
} from '@dashboard/store/dashboardStore';
import { wsManager } from '@services/websocket/WebSocketManager';
import { FloatingRefreshButton } from '@shared/components/FloatingRefreshButton';
import { useEffect, useRef, useState } from 'react';
import { AlertsTabContainer } from '../components/AlertsTab';
import { EventsTabContainer } from '../components/EventsTab';
import { Header } from '../components/Header';
import { IncidentsTabContainer } from '../components/IncidentsTab';
import { EventsByApplicationChart, EventsBySeverityChart, MetricsSummaryCards } from '../components/ResumenTab';
import type { TabId } from '../components/TabBar';
import { TabBar } from '../components/TabBar';
import { useResumenTab } from '../hooks';

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>('resumen');
  const [wsConnected, setWsConnected] = useState(false);

  const { refreshSignal, refresh } = useResumenTab();

  const error = useDashboardStore(selectError);
  const lastUpdated = useDashboardStore(selectLastUpdated);

  const wsInitRef = useRef(false);

  useEffect(() => {
    if (wsInitRef.current) return;
    wsInitRef.current = true;

    const onConnected = () => setWsConnected(true);
    const onDisconnected = () => setWsConnected(false);

    wsManager
      .connect()
      .then(() => {
        setWsConnected(true);
        wsManager.subscribeToChannel('dashboard');
        wsManager.onConnected(onConnected);
        wsManager.onDisconnected(onDisconnected);
      })
      .catch(() => setWsConnected(false));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <Header lastUpdated={lastUpdated} wsConnected={wsConnected} />

      <TabBar active={activeTab} counts={{ resumen: 0, incidentes: 0, alertas: 0, eventos: 0 }} onSelect={setActiveTab} />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
            <p className="font-semibold text-red-800">Error: {error}</p>
          </div>
        )}

        {activeTab === 'resumen' && (
          <>
            <FloatingRefreshButton onClick={refresh} isLoading={false} />
            <MetricsSummaryCards refreshSignal={refreshSignal} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <EventsByApplicationChart refreshSignal={refreshSignal} />
              <EventsBySeverityChart refreshSignal={refreshSignal} />
            </div>
          </>
        )}

        {activeTab === 'incidentes' && <IncidentsTabContainer />}

        {activeTab === 'alertas' && <AlertsTabContainer />}

        {activeTab === 'eventos' && <EventsTabContainer />}
      </main>
    </div>
  );
}
