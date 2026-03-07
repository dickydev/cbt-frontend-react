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
