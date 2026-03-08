import { Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import PackagePage from "./pages/PackagePage";
import UploadQuestionPage from "./pages/UploadQuestionPage";
import SessionPage from "./pages/SessionPage";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />

        <Route path="packages" element={<PackagePage />} />

        <Route path="upload" element={<UploadQuestionPage />} />

        <Route path="sessions" element={<SessionPage />} />
      </Route>
    </Routes>
  );
}
