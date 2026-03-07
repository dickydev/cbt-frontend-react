import { useEffect, useState } from "react";
import client from "../../api/client";

export default function DashboardPage() {
  const [packages, setPackages] = useState([]);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    client.get("/packages").then((res) => setPackages(res.data.data));
  }, []);

  return (
    <div>
      <h1>Dashboard CBT</h1>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Paket Ujian</h3>
          <p>{packages.length}</p>
        </div>

        <div className="card">
          <h3>Session Aktif</h3>
          <p>{sessions.length}</p>
        </div>
      </div>
    </div>
  );
}
