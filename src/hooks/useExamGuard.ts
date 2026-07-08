import { useCallback, useEffect, useRef, useState } from "react";
import client from "../api/client";

interface UseExamGuardProps {
  sessionToken: string;
  initialViolations: number;
}

type ActivityMetadata = Record<string, unknown>;

type ExamActivityType =
  | "hidden"
  | "blur"
  | "fullscreen_exit"
  | "back_navigation";

export function useExamGuard({
  sessionToken,
  initialViolations,
}: UseExamGuardProps) {
  const [violations, setViolations] = useState(initialViolations ?? 0);

  const sentRef = useRef<number>(0);

  // sync dari backend ketika examData berubah
  useEffect(() => {
    setViolations(initialViolations ?? 0);
  }, [initialViolations]);

  const sendActivity = useCallback(
    async (
      activityType: ExamActivityType,
      metadata: ActivityMetadata = {},
    ): Promise<void> => {
      try {
        await client.post("/exam/activity-log", {
          session_token: sessionToken,
          activity_type: activityType,
          metadata,
        });
      } catch (error: unknown) {
        console.error("Gagal kirim activity log", error);
      }
    },
    [sessionToken],
  );

  useEffect(() => {
    if (!sessionToken) return;

    /* ===============================
       ACTIVITY DETECTION
    =============================== */

    const onVisibilityChange = (): void => {
      if (document.hidden) {
        setViolations((v) => v + 1);

        void sendActivity("hidden", {
          at: new Date().toISOString(),
        });
      }
    };

    const onBlur = (): void => {
      setViolations((v) => v + 1);

      void sendActivity("blur", {
        at: new Date().toISOString(),
      });
    };

    const onFullscreenChange = (): void => {
      if (!document.fullscreenElement) {
        setViolations((v) => v + 1);

        void sendActivity("fullscreen_exit", {
          at: new Date().toISOString(),
        });

        void document.documentElement
          .requestFullscreen()
          .catch((error: unknown) => {
            console.warn("Tidak bisa masuk fullscreen lagi", error);
          });
      }
    };

    /* ===============================
       MOBILE SECURITY
    =============================== */

    const preventTouchMove = (event: TouchEvent): void => {
      const target = event.target;

      if (
        target instanceof Element &&
        target.closest("[data-allow-scroll='true']")
      ) {
        return;
      }

      event.preventDefault();
    };

    const preventPinch = (event: TouchEvent): void => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    };

    const preventGesture = (event: Event): void => {
      event.preventDefault();
    };

    /* ===============================
       BLOCK BACK BUTTON
    =============================== */

    history.pushState(null, "", location.href);

    const onPopState = (): void => {
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
  }, [sendActivity, sessionToken]);

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

  const enterFullscreen = async (): Promise<void> => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }

      const orientation = screen.orientation;

      if (typeof orientation.lock === "function") {
        await orientation.lock("portrait");
      }
    } catch (error: unknown) {
      console.error("Gagal masuk fullscreen", error);
    }
  };

  return {
    violations,
    enterFullscreen,
  };
}
