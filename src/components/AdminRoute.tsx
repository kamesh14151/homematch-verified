import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { isAdminAuthenticated } from "@/lib/admin-auth";

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
