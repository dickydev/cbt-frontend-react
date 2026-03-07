import { useState } from "react";
import client from "../../api/client";

export default function UploadQuestionPage() {
  const [file, setFile] = useState<File>();

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    await client.post("/imports/questions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Soal berhasil diupload");
  };

  return (
    <div>
      <h1>Upload Soal</h1>

      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => setFile(e.target.files?.[0])}
      />

      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
