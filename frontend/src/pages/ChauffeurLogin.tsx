import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { useChauffeurAuth, useLang, useTheme } from "@/contexts/AppContexts";
import { Truck, Eye, EyeOff, Loader2, Moon, Sun } from "lucide-react";
import logo from "@/assets/logo.png";
import type { Lang } from "@/i18n/translations";

const ChauffeurLogin = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useChauffeurAuth();
  const { t, lang, setLang } = useLang();
  const { isDark, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Already logged in → go straight to chauffeur space
  if (isLoggedIn) return <Navigate to="/chauffeur" replace />;

  const langs: { code: Lang; flag: string; label: string }[] = [
    { code: "fr", flag: "🇫🇷", label: "FR" },
    { code: "en", flag: "🇬🇧", label: "EN" },
    { code: "ar", flag: "🇲🇦", label: "AR" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/chauffeur", { replace: true });
    } catch (err: any) {
      setError(err?.message || t("wrongCredentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4">
      <div className="fixed top-4 right-4 flex items-center gap-2">
        <div className="flex items-center bg-white/80 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
          {langs.map((l) => (
            <button key={l.code} onClick={() => setLang(l.code)}
              className={`px-2.5 py-1.5 font-body text-xs font-medium transition ${lang === l.code ? "bg-emerald-500 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
              {l.flag} {l.label}
            </button>
          ))}
        </div>
        <button onClick={toggleTheme} className="p-2 rounded-xl bg-white/80 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-sm">
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-3">
              <div className="h-20 w-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center ring-2 ring-emerald-500/20">
                <img src={logo} alt="Logo" className="h-12 w-12" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-emerald-500 flex items-center justify-center">
                <Truck className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
            <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white mt-1">
              Ambulance <span className="text-emerald-600">Fès</span>
            </h1>
            <span className="font-body text-sm text-gray-500 dark:text-gray-400 mt-1">{t("driverSpace")}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-body text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("email")}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"
                placeholder="chauffeur@ambulancefes.ma"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition placeholder-gray-400" />
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("password")}</label>
              <div className="relative">
                <input type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition placeholder-gray-400" />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 font-body text-sm">{error}</div>
            )}
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-body font-semibold text-sm px-4 py-3 rounded-xl transition shadow-lg shadow-emerald-600/30">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" />{t("loggingIn")}</> : t("login")}
            </button>
          </form>
        </div>
        <div className="flex items-center justify-between mt-6 px-1">
          <Link to="/" className="font-body text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition">{t("backToSite")}</Link>
          <Link to="/admin/login" className="font-body text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition">{t("adminSpace")} →</Link>
        </div>
      </div>
    </div>
  );
};

export default ChauffeurLogin;
