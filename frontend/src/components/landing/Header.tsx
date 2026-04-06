import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Moon, Sun, Globe, Truck, Shield } from "lucide-react";
import { useLang, useTheme } from "@/contexts/AppContexts";
import logo from "@/assets/logo.png";
import type { Lang } from "@/i18n/translations";

const Header = () => {
  const { t, lang, setLang } = useLang();
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLang, setShowLang] = useState(false);

  const langs: { code: Lang; flag: string; label: string }[] = [
    { code: "fr", flag: "🇫🇷", label: "Français" },
    { code: "en", flag: "🇬🇧", label: "English" },
    { code: "ar", flag: "🇲🇦", label: "العربية" },
  ];

  const navLinks = [
    { href: "#hero",          label: t("home") },
    { href: "#services",      label: t("services") },
    { href: "#coverage",      label: t("coverage") },
    { href: "#collaborators", label: t("contact") },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <img src={logo} alt="Ambulance Fès" className="h-9 w-9" />
          <span className="font-display font-bold text-gray-900 dark:text-white text-lg leading-tight">
            Ambulance <span className="text-primary">Fès</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <a key={link.href} href={link.href}
              className="font-body text-sm text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Dark mode */}
          <button onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title={isDark ? t("lightMode") : t("darkMode")}>
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Language */}
          <div className="relative">
            <button onClick={() => setShowLang(!showLang)}
              className="flex items-center gap-1.5 p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <Globe className="h-4 w-4" />
              <span className="font-body text-xs font-medium hidden sm:block">{lang.toUpperCase()}</span>
            </button>
            {showLang && (
              <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50 min-w-[140px]">
                {langs.map(l => (
                  <button key={l.code} onClick={() => { setLang(l.code); setShowLang(false); }}
                    className={`w-full text-left px-4 py-2.5 font-body text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${lang === l.code ? "text-primary font-semibold" : "text-gray-700 dark:text-gray-300"}`}>
                    <span>{l.flag}</span> {l.label}
                    {lang === l.code && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chauffeur login */}
          <Link to="/chauffeur/login"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 font-body text-sm font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition">
            <Truck className="h-3.5 w-3.5" /> {t("driverLogin")}
          </Link>


          {/* Mobile menu */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 space-y-2">
          {navLinks.map(link => (
            <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
              className="block font-body text-sm text-gray-700 dark:text-gray-300 hover:text-primary py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
            <Link to="/chauffeur/login" onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-body text-sm font-medium">
              <Truck className="h-4 w-4" /> {t("driverLogin")}
            </Link>
            <Link to="/admin/login" onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-primary text-primary-foreground font-body text-sm font-semibold">
              <Shield className="h-4 w-4" /> {t("adminLogin")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
