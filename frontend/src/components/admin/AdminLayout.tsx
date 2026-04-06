import { useEffect, useState } from "react";
import { useNavigate, Outlet, Navigate } from "react-router-dom";
import { isAdminLoggedIn } from "@/lib/auth";
import AdminSidebar from "./AdminSidebar";
import api from "@/lib/api";

const AdminLayout = () => {
  const navigate = useNavigate();
  // ── STEP 1: synchronous check ── if no token at all, redirect instantly
  const hasToken = isAdminLoggedIn();

  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(hasToken); // only check if token exists

  useEffect(() => {
    if (!hasToken) return; // already handled by early return below

    // ── STEP 2: verify token is still valid server-side
    api.get("/auth/me")
      .then(() => {
        setVerified(true);
        setChecking(false);
      })
      .catch(() => {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        navigate("/admin/login", { replace: true });
      });
  }, []); // run once on mount

  // No token → redirect synchronously, no flash, no spinner
  if (!hasToken) {
    return <Navigate to="/admin/login" replace />;
  }

  // Token exists but API check not done yet → spinner
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted dark:bg-gray-950">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Token verified ✓
  if (!verified) return null;

  return (
    <div className="flex min-h-screen bg-muted dark:bg-gray-950">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-y-auto h-screen p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
