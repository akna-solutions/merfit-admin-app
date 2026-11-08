import { useCallback, useEffect, useRef, useState } from "react";
import { workoutLabService } from "../services/workoutLabService";

export const TERMINAL_STATUSES = ["Completed", "Failed"];
export const isTerminal = (status) => TERMINAL_STATUSES.includes(status);

// Bir testin detayını yükler; durum Pending/Processing ise sonucu MerfitCustomerApi yazana kadar yoklar.
// Yoklama süresi aşılırsa (servis kapalı olabilir) timedOut=true döner; "Yenile" ile tekrar denenebilir.
export function useSimulationPolling(id, { intervalMs = 1500, timeoutMs = 60000 } = {}) {
  const [simulation, setSimulation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timedOut, setTimedOut] = useState(false);
  const [round, setRound] = useState(0);
  const timer = useRef(null);

  const refresh = useCallback(() => setRound((r) => r + 1), []);

  useEffect(() => {
    if (!id) {
      setSimulation(null);
      setError(null);
      setTimedOut(false);
      return undefined;
    }
    let cancelled = false;
    const startedAt = Date.now();
    setLoading(true);
    setError(null);
    setTimedOut(false);

    const tick = async () => {
      try {
        const response = await workoutLabService.getSimulation(id);
        if (cancelled) return;
        const data = response.data;
        setSimulation(data);
        setLoading(false);
        if (!isTerminal(data?.status)) {
          if (Date.now() - startedAt >= timeoutMs) {
            setTimedOut(true);
            return;
          }
          timer.current = setTimeout(tick, intervalMs);
        }
      } catch (e) {
        if (cancelled) return;
        setError(e?.message || "Test sonucu alınamadı.");
        setLoading(false);
      }
    };
    tick();

    return () => {
      cancelled = true;
      clearTimeout(timer.current);
    };
  }, [id, intervalMs, timeoutMs, round]);

  return { simulation, setSimulation, loading, error, timedOut, refresh };
}
