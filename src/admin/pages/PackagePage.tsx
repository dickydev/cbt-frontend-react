import { useEffect, useState } from "react";
import client from "../../api/client";

export default function PackagePage() {
  const [packages, setPackages] = useState([]);

  const [form, setForm] = useState({
    title: "",
    code: "",
    description: "",
    duration_minutes: 60,
  });

  const fetchPackages = async () => {
    const res = await client.get("/packages");

    setPackages(res.data.data);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleCreate = async () => {
    await client.post("/packages", form);

    fetchPackages();
  };

  return (
    <div>
      <h1>Paket Ujian</h1>

      <div className="card">
        <input
          placeholder="Nama ujian"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          placeholder="Kode ujian"
          onChange={(e) => setForm({ ...form, code: e.target.value })}
        />

        <textarea
          placeholder="Deskripsi"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <button onClick={handleCreate}>Buat Paket</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Kode</th>
            <th>Durasi</th>
          </tr>
        </thead>

        <tbody>
          {packages.map((p: any) => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.code}</td>
              <td>{p.durationMinutes} menit</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
