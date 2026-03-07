import { useEffect, useMemo, useState } from "react";

export function useCountdown(expiresAt: string) {
  const expiry = new Date(expiresAt).getTime();

  const calc = () => {
    const now = Date.now();
    const diff = expiry - now;
    return diff > 0 ? diff : 0;
  };

  const [remainingMs, setRemainingMs] = useState(calc());

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingMs(calc());
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const formatted = useMemo(() => {
    const totalSeconds = Math.floor(remainingMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [remainingMs]);

  return {
    remainingMs,
    formatted,
    isExpired: remainingMs === 0,
  };
}
