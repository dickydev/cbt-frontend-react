import { useEffect, useRef, useState } from "react";
import client from "../api/client";

interface UseExamGuardProps {
  sessionToken: string;
}

export function useExamGuard({ sessionToken }: UseExamGuardProps) {
  const [violations, setViolations] = useState(0);
  const sentRef = useRef<number>(0);

  const sendActivity = async (
    activityType: string,
    metadata: Record<string, unknown> = {},
  ) => {
    try {
      await client.post("/exam/activity-log", {
        session_token: sessionToken,
        activity_type: activityType,
        metadata,
      });
    } catch (error) {
      console.error("Gagal kirim activity log", error);
    }
  };

  useEffect(() => {
    if (!sessionToken) return;

    const onVisibilityChange = () => {
      if (document.hidden) {
        setViolations((v) => v + 1);
        void sendActivity("hidden", { at: new Date().toISOString() });
      }
    };

    const onBlur = () => {
      setViolations((v) => v + 1);
      void sendActivity("blur", { at: new Date().toISOString() });
    };

    const onFullscreenChange = async () => {
      if (!document.fullscreenElement) {
        setViolations((v) => v + 1);

        await sendActivity("fullscreen_exit", {
          at: new Date().toISOString(),
        });

        // paksa masuk fullscreen lagi
        try {
          await document.documentElement.requestFullscreen();
        } catch (err) {
          console.warn("Tidak bisa masuk fullscreen lagi", err);
        }
      }
    };

    const preventTouchMove = (e: TouchEvent) => {
      if ((e.target as HTMLElement)?.closest("[data-allow-scroll='true']")) {
        return;
      }
      e.preventDefault();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("touchmove", preventTouchMove, {
      passive: false,
    });

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("touchmove", preventTouchMove);
    };
  }, [sessionToken]);

  useEffect(() => {
    if (violations > sentRef.current) {
      sentRef.current = violations;
    }
  }, [violations]);

  const enterFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.error("Gagal masuk fullscreen", error);
    }
  };

  return {
    violations,
    enterFullscreen,
  };
}
