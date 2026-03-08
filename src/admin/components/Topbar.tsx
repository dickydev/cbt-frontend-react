import { useNavigate } from "react-router-dom";
import { removeAdminToken } from "../../utils/adminStorage";

export default function TopBar() {
  const navigate = useNavigate();

  const logout = () => {
    removeAdminToken();
    navigate("/admin/login");
  };

  return (
    <header className="topbar">
      <div className="title">Dashboard CBT</div>

      <div className="actions">
        <button onClick={logout}>Logout</button>
      </div>

      <style>{`

        .topbar{
          background:white;
          border-bottom:1px solid #e5e7eb;
          padding:16px 24px;
          display:flex;
          justify-content:space-between;
          align-items:center;
        }

        .title{
          font-weight:600;
          font-size:18px;
        }

        button{
          background:#ef4444;
          color:white;
          border:none;
          padding:8px 14px;
          border-radius:6px;
          cursor:pointer;
        }

        button:hover{
          background:#dc2626;
        }

      `}</style>
    </header>
  );
}
