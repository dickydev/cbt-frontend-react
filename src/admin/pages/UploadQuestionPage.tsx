import { useState } from "react";
import client from "../../api/client";

export default function UploadQuestionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Silakan pilih file terlebih dahulu");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      await client.post("/imports/questions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Soal berhasil diupload");
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Upload gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <h1 className="page-title">Upload Soal</h1>

      <div className="upload-row">
        {/* Upload Card */}

        <div className="upload-card">
          <h3>Import Soal dari Excel</h3>

          <p className="info">
            Upload file Excel (.xlsx) sesuai template yang telah disediakan.
          </p>

          <input
            type="file"
            accept=".xlsx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />

          {file && (
            <div className="file-preview">
              File dipilih: <b>{file.name}</b>
            </div>
          )}

          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload Soal"}
          </button>
        </div>

        {/* Guide Card */}

        <div className="guide-card">
          <h3>Format Excel</h3>

          <ul>
            <li>Kolom A: question_text</li>
            <li>Kolom B: option_a</li>
            <li>Kolom C: option_b</li>
            <li>Kolom D: option_c</li>
            <li>Kolom E: option_d</li>
            <li>Kolom F: correct_option</li>
          </ul>
        </div>
      </div>

      <style>{`

        .upload-page{
          display:flex;
          flex-direction:column;
          gap:20px;
          width:100%;
        }

        .page-title{
          font-size:24px;
          font-weight:600;
        }

        /* ROW LAYOUT */

        .upload-row{
          display:flex;
          gap:20px;
          align-items:flex-start;
        }

        .upload-card,
        .guide-card{
          flex:1;
          background:white;
          padding:24px;
          border-radius:10px;
          box-shadow:0 4px 14px rgba(0,0,0,0.06);
          display:flex;
          flex-direction:column;
          gap:12px;
        }

        input[type=file]{
          border:1px solid #e5e7eb;
          padding:10px;
          border-radius:6px;
        }

        .file-preview{
          font-size:14px;
          color:#6b7280;
        }

        button{
          margin-top:10px;
          background:#2563eb;
          color:white;
          border:none;
          padding:10px;
          border-radius:6px;
          cursor:pointer;
          width:160px;
        }

        button:hover{
          background:#1d4ed8;
        }

        ul{
          padding-left:18px;
        }

        li{
          margin-bottom:4px;
        }

        .info{
          font-size:14px;
          color:#6b7280;
        }

      `}</style>
    </div>
  );
}
