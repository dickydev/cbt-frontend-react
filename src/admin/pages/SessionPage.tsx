import { useEffect, useState } from "react";
import client from "../../api/client";

interface Session {
  id: string;
  studentName: string;
  studentClass: string;
  status: string;
  score: number | null;
  answered: number;
  totalQuestions: number;
}

export default function SessionPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const res = await client.get("/admin/sessions");
      setSessions(res.data.data || []);
    } catch (error) {
      console.error("Load session gagal", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();

    // realtime polling tiap 5 detik
    const interval = setInterval(fetchSessions, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div style={{ padding: 20 }}>Loading monitoring...</div>;
  }

  return (
    <div className="session-page">
      <h1 className="page-title">Monitoring Ujian</h1>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Kelas</th>
              <th>Progress</th>
              <th>Score</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {sessions.map((s) => (
              <tr key={s.id}>
                <td>{s.studentName}</td>

                <td>{s.studentClass}</td>

                <td>
                  {s.answered} / {s.totalQuestions}
                </td>

                <td>{s.score ?? "-"}</td>

                <td>
                  <span className={`status ${s.status}`}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`

      .session-page{
        padding:20px;
      }

      .page-title{
        font-size:24px;
        font-weight:600;
        margin-bottom:20px;
      }

      .table-container{
        background:white;
        border-radius:10px;
        box-shadow:0 4px 14px rgba(0,0,0,0.06);
        overflow:hidden;
      }

      table{
        width:100%;
        border-collapse:collapse;
      }

      thead{
        background:#f3f4f6;
      }

      th, td{
        padding:14px;
        text-align:left;
        font-size:14px;
        border-bottom:1px solid #eee;
      }

      th{
        font-weight:600;
      }

      tbody tr:hover{
        background:#fafafa;
      }

      .status{
        padding:4px 10px;
        border-radius:6px;
        font-size:12px;
        font-weight:500;
      }

      .status.in_progress{
        background:#fef3c7;
        color:#92400e;
      }

      .status.submitted{
        background:#d1fae5;
        color:#065f46;
      }

      .status.expired{
        background:#fee2e2;
        color:#991b1b;
      }

      `}</style>
    </div>
  );
}
