import { useEffect, useRef } from "react";

/**
 * Calls `callback` once per animation frame while `running` is true.
 * When `intervalMs` is given, calls are throttled to at most one per interval.
 * The latest `callback` is always used without restarting the loop.
 */
export function useAnimationLoop(running, callback, intervalMs = 0) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    if (!running) return undefined;
    let id;
    let last = -Infinity;
    const tick = (now) => {
      if (now - last >= intervalMs) {
        last = now;
        callbackRef.current();
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [running, intervalMs]);
}
