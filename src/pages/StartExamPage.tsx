import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import type { ApiResponse, SessionExamResponse } from "../types/exam";
import { saveSessionToken } from "../utils/storage";

export default function StartExamPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    student_name: "",
    student_nis: "",
    student_class: "",
    exam_code: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await client.post<ApiResponse<SessionExamResponse>>(
        "/exam/start",
        form,
      );
      const payload = response.data.data;
      saveSessionToken(payload.session_token);
      navigate(`/exam/${payload.session_token}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Gagal memulai ujian");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="start-page">
      <div className="start-card">
        <p className="eyebrow">CBT Sekolah</p>
        <h1>Masuk ke Ujian</h1>
        <p className="muted">Isi identitas dengan benar, lalu mulai ujian.</p>

        <form onSubmit={onSubmit} className="start-form">
          <input
            placeholder="Nama lengkap"
            value={form.student_name}
            onChange={(e) => setForm({ ...form, student_name: e.target.value })}
          />
          <input
            placeholder="NIS / NISN"
            value={form.student_nis}
            onChange={(e) => setForm({ ...form, student_nis: e.target.value })}
          />
          <input
            placeholder="Kelas"
            value={form.student_class}
            onChange={(e) =>
              setForm({ ...form, student_class: e.target.value })
            }
          />
          <input
            placeholder="Kode ujian"
            value={form.exam_code}
            onChange={(e) => setForm({ ...form, exam_code: e.target.value })}
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
