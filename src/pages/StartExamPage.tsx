import { type FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import client from "../api/client";
import type { ApiResponse, SessionExamResponse } from "../types/exam";
import { getSessionToken, saveSessionToken } from "../utils/storage";

type StartExamForm = {
  student_name: string;
  student_nis: string;
  student_class: string;
  exam_code: string;
};

type ApiErrorResponse = {
  message?: string;
};

const getErrorMessage = (error: unknown): string => {
  if (isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.message ?? "Gagal memulai ujian";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Gagal memulai ujian";
};

export default function StartExamPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<StartExamForm>({
    student_name: "",
    student_nis: "",
    student_class: "",
    exam_code: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [checkingSession, setCheckingSession] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = getSessionToken();

    if (!token) {
      setCheckingSession(false);
      return;
    }

    client
      .get<ApiResponse<SessionExamResponse>>(`/exam/session/${token}`)
      .then(() => {
        navigate(`/exam/${token}`);
      })
      .catch(() => {
        localStorage.removeItem("cbt_session_token");
        setCheckingSession(false);
      });
  }, [navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await client.post<ApiResponse<SessionExamResponse>>(
        "/exam/start",
        form,
      );

      const session = response.data.data;

      saveSessionToken(session.session_token);
      navigate(`/exam/${session.session_token}`);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return <div className="center-screen">Memeriksa sesi ujian...</div>;
  }

  return (
    <div className="start-page">
      <div className="start-card">
        <p className="eyebrow">CBT Sekolah</p>
        <h1>Masuk ke Ujian</h1>
        <p className="muted">Isi identitas dengan benar, lalu mulai ujian.</p>

        <form onSubmit={handleSubmit} className="start-form">
          <input
            placeholder="Nama lengkap"
            value={form.student_name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, student_name: e.target.value }))
            }
          />

          <input
            placeholder="NIS / NISN"
            value={form.student_nis}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, student_nis: e.target.value }))
            }
          />

          <input
            placeholder="Kelas"
            value={form.student_class}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, student_class: e.target.value }))
            }
          />

          <input
            placeholder="Kode ujian"
            value={form.exam_code}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, exam_code: e.target.value }))
            }
          />

          {error ? <div className="error-box">{error}</div> : null}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Memulai..." : "Mulai Ujian"}
          </button>
        </form>
      </div>
    </div>
  );
}
