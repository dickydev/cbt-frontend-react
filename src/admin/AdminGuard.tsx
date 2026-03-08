import { Navigate } from "react-router-dom";
import { getAdminToken } from "../utils/adminStorage";
import React from "react";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = getAdminToken();

  if (!token) {
    return <Navigate to="/admin/login" />;
  }

  return children;
}
