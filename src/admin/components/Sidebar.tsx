import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">CBT Admin</div>

      <nav>
        <div className="menu-group">
          <span className="menu-title">Dashboard</span>

          <NavLink to="/admin" end>
            Dashboard
          </NavLink>
        </div>

        <div className="menu-group">
          <span className="menu-title">Manajemen Ujian</span>

          <NavLink to="/admin/packages">Paket Ujian</NavLink>

          <NavLink to="/admin/upload">Upload Soal</NavLink>
        </div>

        <div className="menu-group">
          <span className="menu-title">Monitoring</span>

          <NavLink to="/admin/sessions">Monitoring Ujian</NavLink>
        </div>
      </nav>

      <style>{`

        .sidebar{
          width:240px;
          background:#111827;
          color:white;
          padding:24px 18px;
          display:flex;
          flex-direction:column;
          height:100vh;
        }

        .logo{
          font-size:20px;
          font-weight:700;
          margin-bottom:30px;
        }

        nav{
          display:flex;
          flex-direction:column;
          gap:20px;
        }

        .menu-group{
          display:flex;
          flex-direction:column;
          gap:8px;
        }

        .menu-title{
          font-size:12px;
          color:#9ca3af;
          text-transform:uppercase;
          margin-bottom:6px;
        }

        nav a{
          padding:10px 12px;
          border-radius:6px;
          text-decoration:none;
          color:#d1d5db;
          font-size:14px;
        }

        nav a:hover{
          background:#1f2937;
        }

        nav a.active{
          background:#2563eb;
          color:white;
          font-weight:500;
        }

      `}</style>
    </aside>
  );
}
