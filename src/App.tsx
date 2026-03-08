import { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import StartExamPage from "./pages/StartExamPage";
import ExamPage from "./pages/ExamPage";
import ResultPage from "./pages/ResultPage";

import AdminRoutes from "./admin/routes";
import AdminLoginPage from "./admin/pages/AdminLoginPage";
import AdminGuard from "./admin/AdminGuard";

import { getSessionToken } from "./utils/storage";

function SessionRecovery() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = getSessionToken();

    if (!token) return;

    const isOnExamPage = location.pathname.startsWith("/exam/");
    const isOnResultPage = location.pathname.startsWith("/result");
    const isOnAdmin = location.pathname.startsWith("/admin");

    // jangan ganggu halaman admin
    if (isOnAdmin) return;

    if (!isOnExamPage && !isOnResultPage) {
      navigate(`/exam/${token}`);
    }
  }, [location.pathname, navigate]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <SessionRecovery />

      <Routes>
        {/* ===============================
           STUDENT ROUTES
        =============================== */}

        <Route path="/" element={<StartExamPage />} />

        <Route path="/exam/:token" element={<ExamPage />} />

        <Route path="/result" element={<ResultPage />} />

        {/* ===============================
           ADMIN ROUTES
        =============================== */}

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route
          path="/admin/*"
          element={
            <AdminGuard>
              <AdminRoutes />
            </AdminGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
