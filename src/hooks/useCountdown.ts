import { useEffect, useMemo, useState } from "react";

export function useCountdown(expiresAt: string) {
  const calc = () => Math.max(0, new Date(expiresAt).getTime() - Date.now());
  const [remainingMs, setRemainingMs] = useState(calc());

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemainingMs(calc());
    }, 1000);

    return () => window.clearInterval(interval);
  }, [expiresAt]);

  const formatted = useMemo(() => {
    const totalSeconds = Math.floor(remainingMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map((v) => String(v).padStart(2, "0"))
      .join(":");
  }, [remainingMs]);

  return {
    remainingMs,
    formatted,
    isExpired: remainingMs <= 0,
  };
}
