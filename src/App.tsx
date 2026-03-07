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
import { getSessionToken } from "./utils/storage";

function SessionRecovery() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = getSessionToken();

    if (!token) return;

    const isOnExamPage = location.pathname.startsWith("/exam/");
    const isOnResultPage = location.pathname.startsWith("/result");

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
        <Route path="/" element={<StartExamPage />} />
        <Route path="/exam/:token" element={<ExamPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}
