import { useState } from "react";
import {
  LayoutDashboard, ClipboardList, AlertTriangle, Clock,
  LogOut, Home, Truck, ChevronLeft, ChevronRight,
  Moon, Sun, Globe,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useChauffeurAuth, useLang, useTheme } from "@/contexts/AppContexts";
import logo from "@/assets/logo.png";
import type { Lang } from "@/i18n/translations";

const ChauffeurSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { chauffeur, logout } = useChauffeurAuth();
  const { t, lang, setLang } = useLang();
  const { isDark, toggleTheme } = useTheme();
  const [open, setOpen] = useState(true);
  const [showLang, setShowLang] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: t("myDashboard"), path: "/chauffeur" },
    { icon: ClipboardList,   label: t("myTasks"),     path: "/chauffeur/tasks" },
    { icon: AlertTriangle,   label: t("myProblems"),  path: "/chauffeur/problems" },
    { icon: Clock,           label: t("myHours"),     path: "/chauffeur/hours" },
  ];

  const langs: { code: Lang; label: string }[] = [
    { code: "fr", label: "Français" },
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <aside
        style={{ transition: "width 280ms cubic-bezier(0.4,0,0.2,1)" }}
        className={`fixed top-0 left-0 z-40 h-screen flex flex-col bg-emerald-900 dark:bg-gray-900 shadow-2xl overflow-hidden ${open ? "w-72" : "w-16"}`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-20 left-0 w-24 h-24 bg-emerald-500/10 rounded-full -translate-x-1/2 pointer-events-none" />

        {/* Header */}
        <div className={`relative flex items-center shrink-0 ${open ? "p-5 pb-3 justify-between" : "py-5 justify-center"}`}>
          {open ? (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center ring-2 ring-white/20 shrink-0">
                  <img src={logo} alt="Logo" className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <span className="font-display font-bold text-white text-sm block leading-tight whitespace-nowrap">Ambulance Fès</span>
                  <span className="font-body text-xs text-emerald-300 flex items-center gap-1 whitespace-nowrap">
                    <Truck className="h-3 w-3 shrink-0" /> {t("driverSpace")}
                  </span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="ml-2 p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition shrink-0">
                <ChevronLeft className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button onClick={() => setOpen(true)} className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center ring-2 ring-white/20 hover:bg-white/20 transition">
              <img src={logo} alt="Logo" className="h-5 w-5" />
            </button>
          )}
        </div>

        {!open && (
          <div className="flex justify-center shrink-0 pb-1">
            <button onClick={() => setOpen(true)} className="p-1 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition">
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        )}

        {open && chauffeur && (
          <>
            <div className="px-6 pb-3">
              <div className="bg-white/10 rounded-xl px-3 py-2">
                <p className="font-body text-xs text-emerald-300 whitespace-nowrap">
                  {t("welcome")},
                </p>
                <p className="font-display font-semibold text-white text-sm truncate">
                  {chauffeur.prenom} {chauffeur.nom}
                </p>
                {chauffeur.ambulance && (
                  <p className="font-body text-xs text-emerald-300 mt-0.5 flex items-center gap-1">
                    <Truck className="h-3 w-3" /> {chauffeur.ambulance.immatriculation}
                  </p>
                )}
              </div>
            </div>
            <div className="mx-5 h-px bg-white/10 shrink-0" />
          </>
        )}
        {!open && <div className="mx-3 h-px bg-white/10 shrink-0" />}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 space-y-1 min-h-0 px-2">
          {open && (
            <p className="font-body text-[10px] uppercase tracking-[0.15em] text-emerald-400/50 font-semibold px-3 mb-3 whitespace-nowrap">Navigation</p>
          )}
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== "/chauffeur" && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                title={!open ? item.label : undefined}
                className={`group flex items-center rounded-xl font-body text-sm transition-all duration-200 relative
                  ${open ? "gap-3 px-4 py-3" : "justify-center p-3"}
                  ${isActive
                    ? "bg-emerald-500 text-white font-semibold shadow-lg shadow-emerald-500/30"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <item.icon className={`shrink-0 transition-transform duration-200 ${open ? "h-[18px] w-[18px]" : "h-5 w-5"} ${!isActive ? "group-hover:scale-110" : ""}`} />
                {open && <span className="whitespace-nowrap">{item.label}</span>}
                {open && isActive && <div className="absolute right-3 h-2 w-2 rounded-full bg-white/50" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="shrink-0 py-3 space-y-1 px-2">
          <div className="mx-1 h-px bg-white/10 mb-2" />

          <button onClick={toggleTheme} title={!open ? (isDark ? t("lightMode") : t("darkMode")) : undefined}
            className={`w-full flex items-center rounded-xl font-body text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all ${open ? "gap-3 px-4 py-2.5" : "justify-center p-3"}`}>
            {isDark ? <Sun className={`shrink-0 ${open ? "h-[18px] w-[18px]" : "h-5 w-5"}`} /> : <Moon className={`shrink-0 ${open ? "h-[18px] w-[18px]" : "h-5 w-5"}`} />}
            {open && <span className="whitespace-nowrap">{isDark ? t("lightMode") : t("darkMode")}</span>}
          </button>

          <div className="relative">
            <button onClick={() => setShowLang(!showLang)} title={!open ? t("language") : undefined}
              className={`w-full flex items-center rounded-xl font-body text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all ${open ? "gap-3 px-4 py-2.5" : "justify-center p-3"}`}>
              <Globe className={`shrink-0 ${open ? "h-[18px] w-[18px]" : "h-5 w-5"}`} />
              {open && <span className="whitespace-nowrap">{langs.find(l => l.code === lang)?.label}</span>}
            </button>
            {showLang && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-emerald-800 dark:bg-gray-800 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                {langs.map(l => (
                  <button key={l.code} onClick={() => { setLang(l.code); setShowLang(false); }}
                    className={`w-full text-left px-4 py-2.5 font-body text-sm hover:bg-white/10 transition flex items-center justify-between ${lang === l.code ? "text-emerald-300 font-semibold" : "text-white/70"}`}>
                    {l.label}
                    {lang === l.code && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link to="/" title={!open ? t("backSite") : undefined}
            className={`flex items-center rounded-xl font-body text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all ${open ? "gap-3 px-4 py-2.5" : "justify-center p-3"}`}>
            <Home className={`shrink-0 ${open ? "h-[18px] w-[18px]" : "h-5 w-5"}`} />
            {open && <span className="whitespace-nowrap">{t("backSite")}</span>}
          </Link>

          <button onClick={handleLogout} title={!open ? t("logout") : undefined}
            className={`w-full flex items-center rounded-xl font-body text-sm text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-all ${open ? "gap-3 px-4 py-2.5" : "justify-center p-3"}`}>
            <LogOut className={`shrink-0 ${open ? "h-[18px] w-[18px]" : "h-5 w-5"}`} />
            {open && <span className="whitespace-nowrap">{t("logout")}</span>}
          </button>
        </div>
      </aside>

      <div style={{ transition: "width 280ms cubic-bezier(0.4,0,0.2,1)", flexShrink: 0 }} className={open ? "w-72" : "w-16"} />
    </>
  );
};

export default ChauffeurSidebar;
