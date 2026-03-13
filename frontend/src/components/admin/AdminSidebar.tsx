import { LayoutDashboard, Ambulance, Wrench, AlertTriangle, Clock, LogOut, Home, Shield } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutAdmin } from "@/lib/auth";
import logo from "@/assets/logo.png";

const navItems = [
  { icon: LayoutDashboard, label: "Tableau de Bord", path: "/admin" },
  { icon: Ambulance, label: "Flotte", path: "/admin/fleet" },
  { icon: Wrench, label: "Maintenance", path: "/admin/maintenance" },
  { icon: AlertTriangle, label: "Problèmes", path: "/admin/problems" },
  { icon: Clock, label: "Heures de Travail", path: "/admin/hours" },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/");
  };

  return (
    <aside className="w-72 min-h-screen bg-secondary flex flex-col shadow-2xl relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-20 left-0 w-24 h-24 bg-primary/5 rounded-full -translate-x-1/2" />

      {/* Header */}
      <div className="relative p-6 pb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
            <img src={logo} alt="Logo" className="h-7 w-7" />
          </div>
          <div>
            <span className="font-display font-bold text-secondary-foreground text-base block leading-tight">
              Ambulance Fès
            </span>
            <span className="font-body text-xs text-secondary-foreground/50 flex items-center gap-1">
              <Shield className="h-3 w-3" /> Admin Panel
            </span>
          </div>
        </div>
      </div>

      <div className="mx-6 h-px bg-secondary-foreground/10" />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="font-body text-[10px] uppercase tracking-[0.15em] text-secondary-foreground/30 font-semibold px-4 mb-3">
          Navigation
        </p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm transition-all duration-200 relative ${
                isActive
                  ? "bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/30"
                  : "text-secondary-foreground/60 hover:bg-secondary-foreground/5 hover:text-secondary-foreground"
              }`}
            >
              <item.icon className={`h-[18px] w-[18px] transition-transform duration-200 ${isActive ? "" : "group-hover:scale-110"}`} />
              {item.label}
              {isActive && (
                <div className="absolute right-3 h-2 w-2 rounded-full bg-primary-foreground/50" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 space-y-1">
        <div className="mx-2 h-px bg-secondary-foreground/10 mb-3" />
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-secondary-foreground/60 hover:bg-secondary-foreground/5 hover:text-secondary-foreground transition-all"
        >
          <Home className="h-[18px] w-[18px]" />
          Retour au site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-secondary-foreground/60 hover:bg-destructive/15 hover:text-destructive transition-all"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
