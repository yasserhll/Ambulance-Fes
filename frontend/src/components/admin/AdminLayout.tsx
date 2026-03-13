import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { isAdminLoggedIn } from "@/lib/auth";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate("/admin/login");
    }
  }, [navigate]);

  if (!isAdminLoggedIn()) return null;

  return (
    <div className="flex min-h-screen bg-muted">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
