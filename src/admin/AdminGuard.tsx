import { Navigate } from "react-router-dom";
import { getAdminToken } from "../utils/adminStorage";

export default function AdminGuard({ children }: any) {
  const token = getAdminToken();

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}
