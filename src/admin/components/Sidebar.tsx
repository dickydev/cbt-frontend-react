import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <h2>CBT Admin</h2>

      <nav>
        <Link to="/admin">Dashboard</Link>

        <Link to="/admin/packages">Paket Ujian</Link>

        <Link to="/admin/upload">Upload Soal</Link>

        <Link to="/admin/sessions">Monitoring Ujian</Link>
      </nav>
    </div>
  );
}
