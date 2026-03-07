import { Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import DashboardPage from "./pages/DashboardPage";
import PackagePage from "./pages/PackagePage";
import UploadQuestionPage from "./pages/UploadQuestionPage";
import SessionPage from "./pages/SessionPage";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/packages" element={<PackagePage />} />
        <Route path="/admin/upload" element={<UploadQuestionPage />} />
        <Route path="/admin/sessions" element={<SessionPage />} />
      </Route>
    </Routes>
  );
}
