import { useEffect, useRef, useState } from "react";
import client from "../api/client";

interface UseExamGuardProps {
  sessionToken: string;
  initialViolations: number;
}

export function useExamGuard({
  sessionToken,
  initialViolations,
}: UseExamGuardProps) {
  const [violations, setViolations] = useState(initialViolations ?? 0);

  // sync dari backend ketika examData berubah
  useEffect(() => {
    setViolations(initialViolations ?? 0);
  }, [initialViolations]);

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

    /* ===============================
       ACTIVITY DETECTION
    =============================== */

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

        try {
          await document.documentElement.requestFullscreen();
        } catch (err) {
          console.warn("Tidak bisa masuk fullscreen lagi", err);
        }
      }
    };

    /* ===============================
       MOBILE SECURITY
    =============================== */

    // blok swipe / scroll
    const preventTouchMove = (e: TouchEvent) => {
      if ((e.target as HTMLElement)?.closest("[data-allow-scroll='true']")) {
        return;
      }
      e.preventDefault();
    };

    // blok pinch zoom
    const preventPinch = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // blok gesture navigation
    const preventGesture = (e: Event) => {
      e.preventDefault();
    };

    /* ===============================
       BLOCK BACK BUTTON
    =============================== */

    history.pushState(null, "", location.href);

    const onPopState = () => {
      history.pushState(null, "", location.href);

      setViolations((v) => v + 1);

      void sendActivity("back_navigation", {
        at: new Date().toISOString(),
      });
    };

    /* ===============================
       REGISTER EVENTS
    =============================== */

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    document.addEventListener("fullscreenchange", onFullscreenChange);

    document.addEventListener("touchmove", preventTouchMove, {
      passive: false,
    });

    document.addEventListener("touchstart", preventPinch, {
      passive: false,
    });

    document.addEventListener("gesturestart", preventGesture);

    window.addEventListener("popstate", onPopState);

    /* ===============================
       CLEANUP
    =============================== */

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("fullscreenchange", onFullscreenChange);

      document.removeEventListener("touchmove", preventTouchMove);
      document.removeEventListener("touchstart", preventPinch);
      document.removeEventListener("gesturestart", preventGesture);

      window.removeEventListener("popstate", onPopState);
    };
  }, [sessionToken]);

  /* ===============================
     TRACK VIOLATION STATE
  =============================== */

  useEffect(() => {
    if (violations > sentRef.current) {
      sentRef.current = violations;
    }
  }, [violations]);

  /* ===============================
     FULLSCREEN + ORIENTATION LOCK
  =============================== */

  const enterFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }

      // orientation lock (fix TypeScript)
      const orientation = screen.orientation as any;

      if (orientation?.lock) {
        await orientation.lock("portrait");
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
