import { wsManager } from '@services/websocket/WebSocketManager';
import { useCallback, useEffect, useState } from 'react';

const WS_EVENTS = ['incident:created', 'incident:status_updated', 'alert:created', 'event:registered', 'events:stats:updated'];
const POLL_INTERVAL_MS = 30_000;

export function useResumenTab() {
  const [refreshSignal, setRefreshSignal] = useState(0);
  const refresh = useCallback(() => setRefreshSignal((n) => n + 1), []);

  useEffect(() => {
    WS_EVENTS.forEach((event) => wsManager.on(event, refresh));
    return () => WS_EVENTS.forEach((event) => wsManager.off(event, refresh));
  }, [refresh]);

  useEffect(() => {
    const id = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  return { refreshSignal, refresh };
}
