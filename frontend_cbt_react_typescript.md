# Frontend CBT React + TypeScript

Berikut frontend CBT yang cocok dengan backend Anda. Fokusnya:
- React + TypeScript
- UI segar, sederhana, mobile-friendly
- fullscreen mode
- anti tab switch / blur / visibility change
- anti swipe dasar di area ujian
- autosave realtime
- timer ujian
- navigasi soal

---

## 1. Stack yang disarankan

- React
- TypeScript
- Vite
- React Router DOM
- Axios
- CSS biasa atau Tailwind

Saya buat versi yang ringan dulu: **React + TypeScript + Axios + React Router**.

---

## 2. Install project

```bash
npm create vite@latest cbt-frontend -- --template react-ts
cd cbt-frontend
npm install
npm install axios react-router-dom
```

---

## 3. Struktur folder

```text
src/
├── api/
│   └── client.ts
├── components/
│   ├── ExamHeader.tsx
│   ├── QuestionCard.tsx
│   ├── QuestionPalette.tsx
│   └── WarningBanner.tsx
├── hooks/
│   ├── useCountdown.ts
│   └── useExamGuard.ts
├── pages/
│   ├── StartExamPage.tsx
│   ├── ExamPage.tsx
│   └── ResultPage.tsx
├── types/
│   └── exam.ts
├── utils/
│   └── storage.ts
├── App.tsx
├── main.tsx
└── styles.css
```

---

## 4. Environment

### `.env`

```env
VITE_API_BASE_URL=http://localhost:5500/api
```

---

## 5. Tipe data

### `src/types/exam.ts`

```ts
export interface ExamInfo {
  id: string;
  title: string;
  description?: string | null;
  code: string;
}

export interface ExamOption {
  id: string;
  option_key: string;
  option_text: string;
  display_order: number;
}

export interface ExamQuestion {
  id: string;
  display_order: number;
  question_text: string;
  options: ExamOption[];
  selected_option_id: string | null;
}

export interface SessionExamResponse {
  session_id: string;
  session_token: string;
  student_name: string;
  student_nis: string;
  student_class: string;
  started_at: string;
  expires_at: string;
  duration_minutes: number;
  exam: ExamInfo;
  questions: ExamQuestion[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string> | null;
}
```

---

## 6. API client

### `src/api/client.ts`

```ts
import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
```

---

## 7. Local storage helper

### `src/utils/storage.ts`

```ts
const SESSION_KEY = "cbt_session_token";

export function saveSessionToken(token: string) {
  localStorage.setItem(SESSION_KEY, token);
}

export function getSessionToken() {
  return localStorage.getItem(SESSION_KEY);
}

export function clearSessionToken() {
  localStorage.removeItem(SESSION_KEY);
}
```

---

## 8. Countdown hook

### `src/hooks/useCountdown.ts`

```ts
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
```

---

## 9. Hook anti-cheat / exam guard

### `src/hooks/useExamGuard.ts`

```ts
import { useEffect, useRef, useState } from "react";
import client from "../api/client";

interface UseExamGuardProps {
  sessionToken: string;
}

export function useExamGuard({ sessionToken }: UseExamGuardProps) {
  const [violations, setViolations] = useState(0);
  const sentRef = useRef<number>(0);

  const sendActivity = async (activityType: string, metadata: Record<string, unknown> = {}) => {
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

    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setViolations((v) => v + 1);
        void sendActivity("fullscreen_exit", { at: new Date().toISOString() });
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
    document.addEventListener("touchmove", preventTouchMove, { passive: false });

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
```

Catatan penting:
- Web **tidak bisa** mematikan gesture sistem OS 100%.
- Tapi hook ini sudah mengurangi swipe di area ujian dan mencatat aktivitas blur/hidden/fullscreen exit.

---

## 10. Komponen UI

### `src/components/WarningBanner.tsx`

```tsx
interface WarningBannerProps {
  violations: number;
}

export default function WarningBanner({ violations }: WarningBannerProps) {
  if (violations <= 0) return null;

  return (
    <div className="warning-banner">
      Peringatan: Anda terdeteksi keluar fokus sebanyak <strong>{violations}</strong> kali.
    </div>
  );
}
```

### `src/components/ExamHeader.tsx`

```tsx
interface ExamHeaderProps {
  title: string;
  studentName: string;
  studentClass: string;
  timer: string;
}

export default function ExamHeader({ title, studentName, studentClass, timer }: ExamHeaderProps) {
  return (
    <header className="exam-header">
      <div>
        <p className="eyebrow">Computer Based Test</p>
        <h1>{title}</h1>
        <p>{studentName} • {studentClass}</p>
      </div>
      <div className="timer-box">
        <span>Sisa Waktu</span>
        <strong>{timer}</strong>
      </div>
    </header>
  );
}
```

### `src/components/QuestionPalette.tsx`

```tsx
interface QuestionPaletteProps {
  total: number;
  currentIndex: number;
  answeredMap: Record<string, boolean>;
  questionIds: string[];
  onSelect: (index: number) => void;
}

export default function QuestionPalette({ total, currentIndex, answeredMap, questionIds, onSelect }: QuestionPaletteProps) {
  return (
    <aside className="palette" data-allow-scroll="true">
      <h3>Navigasi Soal</h3>
      <div className="palette-grid">
        {Array.from({ length: total }).map((_, index) => {
          const qid = questionIds[index];
          const answered = answeredMap[qid];
          const active = index === currentIndex;

          return (
            <button
              key={qid}
              type="button"
              className={`palette-btn ${active ? "active" : ""} ${answered ? "answered" : ""}`}
              onClick={() => onSelect(index)}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
```

### `src/components/QuestionCard.tsx`

```tsx
import type { ExamQuestion } from "../types/exam";

interface QuestionCardProps {
  question: ExamQuestion;
  onChoose: (questionId: string, optionId: string) => void;
}

export default function QuestionCard({ question, onChoose }: QuestionCardProps) {
  return (
    <section className="question-card">
      <div className="question-number">Soal {question.display_order}</div>
      <h2>{question.question_text}</h2>

      <div className="option-list">
        {question.options.map((option) => {
          const selected = question.selected_option_id === option.id;
          return (
            <button
              key={option.id}
              type="button"
              className={`option-btn ${selected ? "selected" : ""}`}
              onClick={() => onChoose(question.id, option.id)}
            >
              <span className="option-key">{option.option_key}</span>
              <span>{option.option_text}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
```

---

## 11. Halaman Start Exam

### `src/pages/StartExamPage.tsx`

```tsx
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
      const response = await client.post<ApiResponse<SessionExamResponse>>("/exam/start", form);
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
            onChange={(e) => setForm({ ...form, student_class: e.target.value })}
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
```

---

## 12. Halaman Exam

### `src/pages/ExamPage.tsx`

```tsx
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

  const { violations, enterFullscreen } = useExamGuard({ sessionToken: token });
  const countdown = useCountdown(examData?.expires_at || new Date().toISOString());

  const fetchSession = async () => {
    try {
      setLoading(true);
      const response = await client.get<ApiResponse<SessionExamResponse>>(`/exam/session/${token}`);
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
    if (countdown.isExpired && examData && !submitting) {
      void handleSubmit();
    }
  }, [countdown.isExpired, examData]);

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
    return <div className="center-screen error-box">{error || "Data ujian tidak ditemukan"}</div>;
  }

  const currentQuestion = examData.questions[currentIndex];

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
                onClick={() => setCurrentIndex((v) => Math.min(examData.questions.length - 1, v + 1))}
              >
                Berikutnya
              </button>
            ) : (
              <button type="button" className="danger-btn" onClick={handleSubmit} disabled={submitting}>
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
```

---

## 13. Halaman Result

### `src/pages/ResultPage.tsx`

```tsx
import { useLocation, useNavigate } from "react-router-dom";
import { clearSessionToken } from "../utils/storage";

export default function ResultPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const score = state?.score ?? 0;
  const submittedAt = state?.submitted_at;

  return (
    <div className="center-screen">
      <div className="result-card">
        <p className="eyebrow">Ujian Selesai</p>
        <h1>Nilai Anda</h1>
        <div className="score-circle">{score}</div>
        <p className="muted">Waktu submit: {submittedAt || "-"}</p>
        <button
          className="primary-btn"
          onClick={() => {
            clearSessionToken();
            navigate("/");
          }}
        >
          Kembali
        </button>
      </div>
    </div>
  );
}
```

---

## 14. Router

### `src/App.tsx`

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartExamPage from "./pages/StartExamPage";
import ExamPage from "./pages/ExamPage";
import ResultPage from "./pages/ResultPage";
import "./styles.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartExamPage />} />
        <Route path="/exam/:token" element={<ExamPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### `src/main.tsx`

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

---

## 15. Styling segar dan mudah dipakai

### `src/styles.css`

```css
:root {
  font-family: Inter, system-ui, Arial, sans-serif;
  color: #132238;
  background: linear-gradient(180deg, #eef6ff 0%, #f8fbff 100%);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
}

button,
input {
  font: inherit;
}

.start-page,
.center-screen {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.start-card,
.result-card {
  width: min(100%, 480px);
  background: #ffffff;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 20px 60px rgba(40, 89, 167, 0.12);
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #3d7cff;
}

.muted {
  color: #5f7187;
}

.start-form {
  display: grid;
  gap: 12px;
  margin-top: 20px;
}

.start-form input {
  border: 1px solid #d6e2f1;
  border-radius: 14px;
  padding: 14px 16px;
  background: #f9fbff;
}

.primary-btn,
.secondary-btn,
.danger-btn {
  border: 0;
  border-radius: 14px;
  padding: 14px 18px;
  cursor: pointer;
  font-weight: 700;
}

.primary-btn {
  background: linear-gradient(135deg, #2f80ff, #5f9bff);
  color: white;
}

.secondary-btn {
  background: #eef4fb;
  color: #1f3654;
}

.danger-btn {
  background: #ef4444;
  color: white;
}

.error-box,
.warning-banner {
  border-radius: 14px;
  padding: 12px 14px;
}

.error-box {
  background: #ffe8e8;
  color: #a12626;
}

.warning-banner {
  margin: 16px 24px 0;
  background: #fff4db;
  color: #8a5a00;
}

.exam-page {
  min-height: 100vh;
  padding: 20px;
}

.exam-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  background: white;
  border-radius: 24px;
  padding: 20px 24px;
  box-shadow: 0 20px 60px rgba(40, 89, 167, 0.1);
}

.exam-header h1 {
  margin: 4px 0;
}

.timer-box {
  min-width: 160px;
  background: #132238;
  color: white;
  border-radius: 18px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.timer-box strong {
  font-size: 28px;
}

.exam-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
  margin-top: 20px;
}

.exam-main {
  display: grid;
  gap: 16px;
}

.question-card,
.palette {
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 20px 60px rgba(40, 89, 167, 0.1);
}

.question-number {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  background: #eef5ff;
  color: #2f80ff;
  font-weight: 700;
  margin-bottom: 12px;
}

.option-list {
  display: grid;
  gap: 12px;
  margin-top: 20px;
}

.option-btn {
  border: 1px solid #d6e2f1;
  background: #fbfdff;
  border-radius: 18px;
  padding: 14px 16px;
  display: flex;
  gap: 12px;
  align-items: center;
  text-align: left;
  cursor: pointer;
}

.option-btn.selected {
  border-color: #2f80ff;
  background: #eef5ff;
}

.option-key {
  width: 36px;
  height: 36px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: #dce9ff;
  font-weight: 700;
}

.palette h3 {
  margin-top: 0;
}

.palette-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.palette-btn {
  border: 0;
  border-radius: 12px;
  height: 44px;
  background: #eef4fb;
  cursor: pointer;
  font-weight: 700;
}

.palette-btn.answered {
  background: #d7f5e8;
}

.palette-btn.active {
  background: #2f80ff;
  color: white;
}

.action-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.score-circle {
  width: 160px;
  height: 160px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  margin: 24px auto;
  font-size: 42px;
  font-weight: 800;
  background: linear-gradient(135deg, #2f80ff, #7cb0ff);
  color: white;
}

@media (max-width: 960px) {
  .exam-layout {
    grid-template-columns: 1fr;
  }

  .palette {
    order: -1;
  }
}

@media (max-width: 640px) {
  .exam-header {
    flex-direction: column;
    align-items: stretch;
  }

  .timer-box {
    min-width: auto;
  }

  .palette-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

## 16. Apa yang sudah diatasi dari masalah awal

Frontend ini sudah menerapkan:

### A. Floating app / keluar fokus
- `visibilitychange`
- `blur`
- `fullscreenchange`
- kirim ke `/api/exam/activity-log`

### B. Swipe / gesture di area ujian
- `touchmove` dicegah di area ujian secara dasar
- tetap jujur: gesture sistem HP tidak bisa diblok total oleh web biasa

### C. Fullscreen mode
- saat masuk halaman ujian, frontend mencoba masuk fullscreen
- jika keluar fullscreen, backend dicatat sebagai pelanggaran

### D. Autosave realtime
- setiap klik jawaban langsung memanggil `/api/exam/autosave`

### E. Timer ujian
- memakai `expires_at` dari backend
- saat habis, otomatis submit

---

## 17. Langkah menjalankan frontend

```bash
npm run dev
```

Biasanya Vite akan jalan di:

```text
http://localhost:5173
```

Pastikan backend tetap jalan di:

```text
http://localhost:5500
```

---

## 18. Catatan penting

Karena ini web biasa:
- tidak bisa mengunci OS 100%
- tidak bisa mencegah semua floating app sistem
- tidak bisa memblok split screen / app switch sistem sepenuhnya

Tetapi versi ini sudah cukup kuat untuk level CBT sekolah karena:
- perilaku keluar fokus tercatat
- fullscreen dipantau
- jawaban autosave
- soal tidak berubah saat refresh

---

## 19. Tahap berikutnya yang disarankan

Setelah frontend siswa ini jalan, berikutnya paling penting:
1. halaman admin guru
2. upload Excel dari dashboard
3. daftar hasil ujian siswa
4. export nilai ke Excel
5. batas pelanggaran otomatis submit

Jika ingin, dokumen ini bisa dilanjutkan menjadi versi dashboard admin juga.

