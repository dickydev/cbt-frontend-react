import { useLocation, useNavigate } from "react-router-dom";

interface ResultState {
  session_token: string;
  score: number;
  submitted_at: string;
}

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state as ResultState | null;

  if (!result) {
    return (
      <div className="result-page">
        <h2>Data hasil ujian tidak ditemukan</h2>
        <button onClick={() => navigate("/")}>Kembali</button>
      </div>
    );
  }

  const scoreColor =
    result.score >= 80 ? "green" : result.score >= 60 ? "orange" : "red";

  return (
    <div className="result-page">
      <div className="result-card">
        <h1>Hasil Ujian</h1>

        <div className="score-box">
          <span className={`score ${scoreColor}`}>{result.score}</span>
        </div>

        <div className="result-info">
          <div className="info-row">
            <span>Session</span>
            <b>{result.session_token}</b>
          </div>

          <div className="info-row">
            <span>Waktu Submit</span>
            <b>{new Date(result.submitted_at).toLocaleString()}</b>
          </div>
        </div>

        <button className="back-btn" onClick={() => navigate("/")}>
          Selesai
        </button>
      </div>

      <style>{`

        .result-page{
          height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          background:#f3f4f6;
        }

        .result-card{
          background:white;
          padding:40px;
          border-radius:12px;
          width:380px;
          text-align:center;
          box-shadow:0 10px 30px rgba(0,0,0,0.1);
        }

        h1{
          margin-bottom:20px;
        }

        .score-box{
          margin:20px 0;
        }

        .score{
          font-size:60px;
          font-weight:bold;
        }

        .score.green{
          color:#16a34a;
        }

        .score.orange{
          color:#ea580c;
        }

        .score.red{
          color:#dc2626;
        }

        .result-info{
          margin-top:20px;
          text-align:left;
          display:flex;
          flex-direction:column;
          gap:10px;
        }

        .info-row{
          display:flex;
          justify-content:space-between;
          font-size:14px;
        }

        .back-btn{
          margin-top:25px;
          width:100%;
          padding:10px;
          background:#2563eb;
          color:white;
          border:none;
          border-radius:6px;
          cursor:pointer;
        }

        .back-btn:hover{
          background:#1d4ed8;
        }

      `}</style>
    </div>
  );
}
