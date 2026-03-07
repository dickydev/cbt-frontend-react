import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartExamPage from "./pages/StartExamPage";
import ExamPage from "./pages/ExamPage";
import ResultPage from "./pages/ResultPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartExamPage />} />
        <Route path="/exam/:token" element={<ExamPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>
  );
}
