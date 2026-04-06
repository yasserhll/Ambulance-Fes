import { useNavigate, Outlet, Navigate } from "react-router-dom";
import { useChauffeurAuth } from "@/contexts/AppContexts";
import ChauffeurSidebar from "./ChauffeurSidebar";

const ChauffeurLayout = () => {
  const { isLoggedIn } = useChauffeurAuth();

  // Synchronous redirect — no flash, no spinner
  if (!isLoggedIn) {
    return <Navigate to="/chauffeur/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-muted dark:bg-gray-950">
      <ChauffeurSidebar />
      <main className="flex-1 min-w-0 overflow-y-auto h-screen p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ChauffeurLayout;
