import { useState } from "react";
import client from "../../api/client";
import { setAdminToken } from "../../utils/adminStorage";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await client.post("/admin/login", {
        username,
        password,
      });

      setAdminToken(res.data.data.token);

      navigate("/admin");
    } catch {
      alert("Login gagal");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Admin CBT</h2>

        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>Login</button>
      </div>

      <style>{`

        .login-page{
          height:100vh;
          display:flex;
          align-items:center;
          justify-content:center;
          background:#f3f4f6;
        }

        .login-card{
          background:white;
          padding:40px;
          border-radius:10px;
          width:320px;
          display:flex;
          flex-direction:column;
          gap:14px;
          box-shadow:0 10px 30px rgba(0,0,0,0.1);
        }

        input{
          padding:10px;
          border:1px solid #ddd;
          border-radius:6px;
        }

        button{
          background:#2563eb;
          color:white;
          padding:10px;
          border:none;
          border-radius:6px;
          cursor:pointer;
        }

        button:hover{
          background:#1d4ed8;
        }

      `}</style>
    </div>
  );
}
