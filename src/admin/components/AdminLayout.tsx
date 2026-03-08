import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./Topbar";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-main">
        <TopBar />

        <div className="admin-content">
          <Outlet />
        </div>
      </div>

      <style>{`
        .admin-layout{
          display:flex;
          min-height:100vh;
          background:#f3f4f6;
        }

        .admin-main{
          flex:1;
          display:flex;
          flex-direction:column;
        }

        .admin-content{
          padding:30px;
        }
      `}</style>
    </div>
  );
}
