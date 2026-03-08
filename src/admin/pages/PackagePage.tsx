import { useEffect, useState } from "react";
import client from "../../api/client";

interface ExamPackage {
  id: string;
  title: string;
  code: string;
  durationMinutes: number;
}

export default function PackagePage() {
  const [packages, setPackages] = useState<ExamPackage[]>([]);

  const [form, setForm] = useState({
    title: "",
    code: "",
    description: "",
    duration_minutes: 60,
  });

  const fetchPackages = async () => {
    const res = await client.get("/packages");
    setPackages(res.data.data || []);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleCreate = async () => {
    if (!form.title || !form.code) {
      alert("Title dan kode wajib diisi");
      return;
    }

    await client.post("/packages", form);

    setForm({
      title: "",
      code: "",
      description: "",
      duration_minutes: 60,
    });

    fetchPackages();
  };

  return (
    <div className="package-page">
      <h1 className="page-title">Paket Ujian</h1>

      <div className="layout">
        {/* FORM */}

        <div className="form-card">
          <h3>Buat Paket Ujian</h3>

          <input
            placeholder="Nama ujian"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            placeholder="Kode ujian"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />

          <textarea
            placeholder="Deskripsi ujian"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <input
            type="number"
            placeholder="Durasi menit"
            value={form.duration_minutes}
            onChange={(e) =>
              setForm({
                ...form,
                duration_minutes: Number(e.target.value),
              })
            }
          />

          <button onClick={handleCreate}>Buat Paket</button>
        </div>

        {/* TABLE */}

        <div className="table-card">
          <h3>Daftar Paket</h3>

          <table>
            <thead>
              <tr>
                <th>Nama Ujian</th>
                <th>Kode</th>
                <th>Durasi</th>
              </tr>
            </thead>

            <tbody>
              {packages.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.code}</td>
                  <td>{p.durationMinutes} menit</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`

        .page-title{
          font-size:24px;
          margin-bottom:20px;
          font-weight:600;
        }

        .layout{
          display:grid;
          grid-template-columns:300px 1fr;
          gap:20px;
        }

        .form-card{
          background:white;
          padding:20px;
          border-radius:10px;
          box-shadow:0 4px 12px rgba(0,0,0,0.05);
          display:flex;
          flex-direction:column;
          gap:10px;
          height:fit-content;
        }

        .form-card h3{
          margin-bottom:10px;
        }

        input, textarea{
          padding:10px;
          border:1px solid #ddd;
          border-radius:6px;
          font-size:14px;
        }

        textarea{
          resize:none;
          height:80px;
        }

        button{
          margin-top:10px;
          background:#2563eb;
          color:white;
          border:none;
          padding:10px;
          border-radius:6px;
          cursor:pointer;
        }

        button:hover{
          background:#1d4ed8;
        }

        .table-card{
          background:white;
          padding:20px;
          border-radius:10px;
          box-shadow:0 4px 12px rgba(0,0,0,0.05);
        }

        table{
          width:100%;
          border-collapse:collapse;
          margin-top:10px;
        }

        th{
          text-align:left;
          padding:10px;
          border-bottom:1px solid #eee;
          font-size:14px;
          color:#6b7280;
        }

        td{
          padding:10px;
          border-bottom:1px solid #f3f4f6;
        }

        tr:hover{
          background:#f9fafb;
        }

      `}</style>
    </div>
  );
}
