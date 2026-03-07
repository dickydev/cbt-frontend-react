import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import client from "../api/client";
import ExamHeader from "../components/ExamHeader";
import QuestionCard from "../components/QuestionCard";
import QuestionPalette from "../components/QuestionPalette";
import WarningBanner from "../components/WarningBanner";
import { useCountdown } from "../hooks/useCountdown";
import { useExamGuard } from "../hooks/useExamGuard";
import type { ApiResponse, SessionExamResponse } from "../types/exam";

export default function ExamPage() {
  const { token = "" } = useParams();
  const navigate = useNavigate();
  const [examData, setExamData] = useState<SessionExamResponse | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { violations, enterFullscreen } = useExamGuard({
    sessionToken: token,
    initialViolations: examData?.violation_count ?? 0,
  });

  const countdown = useCountdown(examData?.expires_at);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const response = await client.get<ApiResponse<SessionExamResponse>>(
        `/exam/session/${token}`,
      );
      setExamData(response.data.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Gagal memuat sesi ujian");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSession();
  }, [token]);

  useEffect(() => {
    void enterFullscreen();
  }, []);

  useEffect(() => {
    if (!examData) return;
    if (!countdown.isExpired) return;
    if (submitting) return;

    console.log("Timer expired → auto submit");

    handleSubmit();
  }, [countdown.isExpired]);

  const answeredMap = useMemo(() => {
    const result: Record<string, boolean> = {};
    examData?.questions.forEach((q) => {
      result[q.id] = Boolean(q.selected_option_id);
    });
    return result;
  }, [examData]);

  const handleChoose = async (questionId: string, optionId: string) => {
    if (!examData) return;

    setExamData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        questions: prev.questions.map((q) =>
          q.id === questionId ? { ...q, selected_option_id: optionId } : q,
        ),
      };
    });

    try {
      await client.post("/exam/autosave", {
        session_token: examData.session_token,
        question_id: questionId,
        selected_option_id: optionId,
      });
    } catch (err) {
      console.error("Autosave gagal", err);
    }
  };

  const handleSubmit = async () => {
    if (!examData) return;
    setSubmitting(true);
    try {
      const response = await client.post("/exam/submit", {
        session_token: examData.session_token,
      });
      navigate("/result", { state: response.data.data });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Gagal submit ujian");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="center-screen">Memuat ujian...</div>;
  }

  if (error || !examData) {
    return (
      <div className="center-screen error-box">
        {error || "Data ujian tidak ditemukan"}
      </div>
    );
  }

  const currentQuestion = examData.questions[currentIndex];

  console.log("expires_at", examData?.expires_at);
  console.log("remaining", countdown.remainingMs);
  console.log("isExpired", countdown.isExpired);

  console.log("backend violation", examData?.violation_count);
  console.log("frontend violation", violations);
  return (
    <div className="exam-page">
      <ExamHeader
        title={examData.exam.title}
        studentName={examData.student_name}
        studentClass={examData.student_class}
        timer={countdown.formatted}
      />

      <WarningBanner violations={violations} />

      <div className="exam-layout">
        <div className="exam-main">
          <QuestionCard question={currentQuestion} onChoose={handleChoose} />

          <div className="action-row">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setCurrentIndex((v) => Math.max(0, v - 1))}
              disabled={currentIndex === 0}
            >
              Sebelumnya
            </button>

            {currentIndex < examData.questions.length - 1 ? (
              <button
                type="button"
                className="primary-btn"
                onClick={() =>
                  setCurrentIndex((v) =>
                    Math.min(examData.questions.length - 1, v + 1),
                  )
                }
              >
                Berikutnya
              </button>
            ) : (
              <button
                type="button"
                className="danger-btn"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Mengirim..." : "Selesaikan Ujian"}
              </button>
            )}
          </div>
        </div>

        <QuestionPalette
          total={examData.questions.length}
          currentIndex={currentIndex}
          answeredMap={answeredMap}
          questionIds={examData.questions.map((q) => q.id)}
          onSelect={setCurrentIndex}
        />
      </div>
    </div>
  );
}
