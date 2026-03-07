import { useEffect, useState } from "react";
import client from "../../api/client";

export default function SessionPage() {
  const [sessions, setSessions] = useState([]);

  const fetchSessions = async () => {
    const res = await client.get("/admin/sessions");

    setSessions(res.data.data);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div>
      <h1>Monitoring Ujian</h1>

      <table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Kelas</th>
            <th>Status</th>
            <th>Score</th>
          </tr>
        </thead>

        <tbody>
          {sessions.map((s: any) => (
            <tr key={s.id}>
              <td>{s.studentName}</td>
              <td>{s.studentClass}</td>
              <td>{s.status}</td>
              <td>{s.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
