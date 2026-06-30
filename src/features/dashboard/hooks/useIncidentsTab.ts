import { wsManager } from '@services/websocket/WebSocketManager';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useIncidentsTab() {
  const [refreshSignal, setRefreshSignal] = useState(0);
  const [count, setCount] = useState(0);
  const isActiveRef = useRef(false);

  useEffect(() => {
    const onCreated = () => {
      setCount((n) => n + 1);
      if (isActiveRef.current) setRefreshSignal((n) => n + 1);
    };
    wsManager.on('incident:created', onCreated);
    wsManager.on('incident:status_updated', onCreated);
    return () => {
      wsManager.off('incident:created', onCreated);
      wsManager.off('incident:status_updated', onCreated);
    };
  }, []);

  const subscribe = useCallback(() => { isActiveRef.current = true; }, []);
  const unsubscribe = useCallback(() => { isActiveRef.current = false; }, []);
  const resetCount = useCallback(() => setCount(0), []);

  return { refreshSignal, count, subscribe, unsubscribe, resetCount };
}
