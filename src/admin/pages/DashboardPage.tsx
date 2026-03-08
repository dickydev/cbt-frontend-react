import { useEffect, useState } from "react";
import client from "../../api/client";

interface ExamPackage {
  id: string;
  title: string;
}

interface ExamSession {
  id: string;
}

export default function DashboardPage() {
  const [packages, setPackages] = useState<ExamPackage[]>([]);
  const [sessions, setSessions] = useState<ExamSession[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const pkg = await client.get("/packages");
        const ses = await client.get("/exam/sessions");

        setPackages(pkg.data.data || []);
        setSessions(ses.data.data || []);
      } catch (e) {
        console.error(e);
      }
    };

    load();
  }, []);

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>

      <div className="cards">
        <div className="card blue">
          <div className="card-title">Paket Ujian</div>
          <div className="card-value">{packages.length}</div>
        </div>

        <div className="card green">
          <div className="card-title">Session Ujian</div>
          <div className="card-value">{sessions.length}</div>
        </div>
      </div>

      <style>{`

        .page-title{
          font-size:24px;
          margin-bottom:20px;
          font-weight:600;
        }

        .cards{
          display:flex;
          gap:20px;
        }

        .card{
          background:white;
          border-radius:10px;
          padding:24px;
          min-width:220px;
          box-shadow:0 4px 14px rgba(0,0,0,0.05);
        }

        .card-title{
          color:#6b7280;
          font-size:14px;
        }

        .card-value{
          font-size:32px;
          font-weight:700;
          margin-top:6px;
        }

        .blue{
          border-left:5px solid #2563eb;
        }

        .green{
          border-left:5px solid #10b981;
        }

      `}</style>
    </div>
  );
}
