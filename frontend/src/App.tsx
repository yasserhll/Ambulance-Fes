import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import FleetManagement from "./pages/admin/FleetManagement";
import MaintenancePage from "./pages/admin/MaintenancePage";
import DriversPage from "./pages/admin/DriversPage";
import WorkHoursPage from "./pages/admin/WorkHoursPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Page publique */}
          <Route path="/" element={<Index />} />

          {/* Accès admin : /admin → login si non connecté, sinon dashboard */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Espace admin protégé */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="fleet" element={<FleetManagement />} />
            <Route path="drivers" element={<DriversPage />} />
            <Route path="maintenance" element={<MaintenancePage />} />
            <Route path="hours" element={<WorkHoursPage />} />
            {/* Redirection de l'ancienne route problèmes vers maintenance */}
            <Route path="problems" element={<Navigate to="/admin/maintenance" replace />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
