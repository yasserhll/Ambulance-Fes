import { useState } from "react";
import {
  LayoutDashboard, Ambulance, Wrench,
  Clock, LogOut, Home, Shield, ChevronLeft, ChevronRight, Users,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutAdmin, getAdminUser } from "@/lib/auth";
import logo from "@/assets/logo.png";

const navItems = [
  { icon: LayoutDashboard, label: "Tableau de Bord",    path: "/admin" },
  { icon: Ambulance,       label: "Ambulances",          path: "/admin/fleet" },
  { icon: Users,           label: "Chauffeurs",          path: "/admin/drivers" },
  { icon: Wrench,          label: "Maintenance & Problèmes", path: "/admin/maintenance" },
  { icon: Clock,           label: "Heures de Travail",   path: "/admin/hours" },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user     = getAdminUser();
  const [open, setOpen] = useState(true);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/");
  };

  return (
    <>
      <aside
        style={{ transition: "width 280ms cubic-bezier(0.4,0,0.2,1)" }}
        className={`fixed top-0 left-0 z-40 h-screen flex flex-col bg-secondary shadow-2xl overflow-hidden ${open ? "w-72" : "w-16"}`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-24 h-24 bg-primary/5 rounded-full -translate-x-1/2 pointer-events-none" />

        {/* Header */}
        <div className={`relative flex items-center shrink-0 ${open ? "p-5 pb-3 justify-between" : "py-5 justify-center"}`}>
          {open ? (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20 shrink-0">
                  <img src={logo} alt="Logo" className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <span className="font-display font-bold text-secondary-foreground text-sm block leading-tight whitespace-nowrap">Ambulance Fès</span>
                  <span className="font-body text-xs text-secondary-foreground/50 flex items-center gap-1 whitespace-nowrap">
                    <Shield className="h-3 w-3 shrink-0" /> Admin Panel
                  </span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="ml-2 p-1.5 rounded-lg text-secondary-foreground/40 hover:text-secondary-foreground hover:bg-secondary-foreground/10 transition shrink-0" title="Réduire">
                <ChevronLeft className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button onClick={() => setOpen(true)} className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20 hover:bg-primary/20 transition" title="Agrandir">
              <img src={logo} alt="Logo" className="h-5 w-5" />
            </button>
          )}
        </div>

        {!open && (
          <div className="flex justify-center shrink-0 pb-1">
            <button onClick={() => setOpen(true)} className="p-1 rounded-lg text-secondary-foreground/30 hover:text-secondary-foreground hover:bg-secondary-foreground/10 transition" title="Agrandir">
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        )}

        {open && (
          <>
            {user && (
              <p className="font-body text-xs text-secondary-foreground/40 px-6 pb-2 truncate shrink-0 whitespace-nowrap">{user.name}</p>
            )}
            <div className="mx-5 h-px bg-secondary-foreground/10 shrink-0" />
          </>
        )}
        {!open && <div className="mx-3 h-px bg-secondary-foreground/10 shrink-0" />}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-1 min-h-0 px-2">
          {open && (
            <p className="font-body text-[10px] uppercase tracking-[0.15em] text-secondary-foreground/30 font-semibold px-3 mb-3 whitespace-nowrap">Navigation</p>
          )}
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== "/admin" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                title={!open ? item.label : undefined}
                className={`group flex items-center rounded-xl font-body text-sm transition-all duration-200 relative
                  ${open ? "gap-3 px-4 py-3" : "justify-center p-3"}
                  ${isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/30"
                    : "text-secondary-foreground/60 hover:bg-secondary-foreground/5 hover:text-secondary-foreground"
                  }`}
              >
                <item.icon className={`shrink-0 transition-transform duration-200 ${open ? "h-[18px] w-[18px]" : "h-5 w-5"} ${isActive ? "" : "group-hover:scale-110"}`} />
                {open && <span className="whitespace-nowrap">{item.label}</span>}
                {open && isActive && <div className="absolute right-3 h-2 w-2 rounded-full bg-primary-foreground/50" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="shrink-0 py-3 space-y-1 bg-secondary px-2">
          <div className="mx-1 h-px bg-secondary-foreground/10 mb-3" />
          <Link to="/" title={!open ? "Retour au site" : undefined} className={`flex items-center rounded-xl font-body text-sm text-secondary-foreground/60 hover:bg-secondary-foreground/5 hover:text-secondary-foreground transition-all ${open ? "gap-3 px-4 py-3" : "justify-center p-3"}`}>
            <Home className={`shrink-0 ${open ? "h-[18px] w-[18px]" : "h-5 w-5"}`} />
            {open && <span className="whitespace-nowrap">Retour au site</span>}
          </Link>
          <button onClick={handleLogout} title={!open ? "Déconnexion" : undefined} className={`w-full flex items-center rounded-xl font-body text-sm text-secondary-foreground/60 hover:bg-destructive/15 hover:text-destructive transition-all ${open ? "gap-3 px-4 py-3" : "justify-center p-3"}`}>
            <LogOut className={`shrink-0 ${open ? "h-[18px] w-[18px]" : "h-5 w-5"}`} />
            {open && <span className="whitespace-nowrap">Déconnexion</span>}
          </button>
        </div>
      </aside>

      <div style={{ transition: "width 280ms cubic-bezier(0.4,0,0.2,1)", flexShrink: 0 }} className={open ? "w-72" : "w-16"} />
    </>
  );
};

export default AdminSidebar;
