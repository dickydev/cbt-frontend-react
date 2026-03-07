import { useEffect, useState } from "react";

export function useCountdown(expiresAt?: string) {
  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    if (!expiresAt) return;

    const expiry = new Date(expiresAt).getTime();

    const update = () => {
      const now = Date.now();
      const diff = expiry - now;

      setRemainingMs(diff > 0 ? diff : 0);
    };

    update(); // hitung langsung saat load

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const totalSeconds = Math.floor(remainingMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formatted = `${String(hours).padStart(2, "0")}:${String(
    minutes,
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return {
    remainingMs,
    formatted,
    isExpired: remainingMs <= 0,
  };
}
