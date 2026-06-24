/**
 * Hook custom para polling
 * Maneja intervalos automáticos de actualización
 */

import { useEffect, useRef } from 'react';

interface UsePollingOptions {
  enabled: boolean;
  interval: number;
  onPoll: () => Promise<void>;
}

export function usePolling({ enabled, interval, onPoll }: UsePollingOptions): void {
  const onPollRef = useRef(onPoll);
  onPollRef.current = onPoll;

  useEffect(() => {
    if (!enabled) return;

    const id = setInterval(() => {
      onPollRef.current().catch((err) => console.error('Poll error:', err));
    }, interval);

    return () => clearInterval(id);
  }, [enabled, interval]);
}
