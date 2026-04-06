import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LangProvider, ThemeProvider, ChauffeurAuthProvider } from "@/contexts/AppContexts";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import FleetManagement from "./pages/admin/FleetManagement";
import MaintenancePage from "./pages/admin/MaintenancePage";
import DriversPage from "./pages/admin/DriversPage";
import WorkHoursPage from "./pages/admin/WorkHoursPage";
import ProblemsPage from "./pages/admin/ProblemsPage";
import AccountsPage from "./pages/admin/AccountsPage";
import AdminTasksPage from "./pages/admin/AdminTasksPage";
import ChauffeurLogin from "./pages/ChauffeurLogin";
import ChauffeurLayout from "./components/chauffeur/ChauffeurLayout";
import ChauffeurDashboard from "./pages/chauffeur/ChauffeurDashboard";
import ChauffeurTaches from "./pages/chauffeur/ChauffeurTaches";
import ChauffeurProblemes from "./pages/chauffeur/ChauffeurProblemes";
import ChauffeurHeures from "./pages/chauffeur/ChauffeurHeures";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LangProvider>
        <ChauffeurAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="fleet" element={<FleetManagement />} />
                  <Route path="drivers" element={<DriversPage />} />
                  <Route path="maintenance" element={<MaintenancePage />} />
                  <Route path="problems" element={<ProblemsPage />} />
                  <Route path="hours" element={<WorkHoursPage />} />
                  <Route path="accounts" element={<AccountsPage />} />
                  <Route path="tasks" element={<AdminTasksPage />} />
                </Route>
                <Route path="/chauffeur/login" element={<ChauffeurLogin />} />
                <Route path="/chauffeur" element={<ChauffeurLayout />}>
                  <Route index element={<ChauffeurDashboard />} />
                  <Route path="tasks" element={<ChauffeurTaches />} />
                  <Route path="problems" element={<ChauffeurProblemes />} />
                  <Route path="hours" element={<ChauffeurHeures />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ChauffeurAuthProvider>
      </LangProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
