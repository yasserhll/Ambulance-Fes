import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { isAdminLoggedIn } from "@/lib/auth";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      navigate("/admin/login");
    } else {
      setChecked(true);
    }
  }, [navigate]);

  if (!checked) return null;

  return (
    // flex-row : sidebar fixe à gauche + contenu à droite
    <div className="flex min-h-screen bg-muted">
      <AdminSidebar />
      {/* Le main prend tout l'espace restant et scroll indépendamment */}
      <main className="flex-1 min-w-0 overflow-y-auto h-screen p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
