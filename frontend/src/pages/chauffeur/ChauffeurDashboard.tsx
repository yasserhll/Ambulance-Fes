import { useEffect, useState } from "react";
import { useChauffeurAuth, useLang } from "@/contexts/AppContexts";
import { ClipboardList, AlertTriangle, Clock, CheckCircle, Loader2, TrendingUp, Truck } from "lucide-react";

const chauffeurApi = async (path: string) => {
  const token = localStorage.getItem("chauffeur_token");
  const base = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  const res = await fetch(`${base}${path}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("API error");
  return res.json();
};

interface Stats {
  taches: { total: number; en_attente: number; en_cours: number; terminee: number; confirmees: number };
  problemes: { total: number; ouvert: number; resolu: number };
  heures: { total_mois: number; interventions_mois: number };
  ambulance?: { immatriculation: string; statut: string };
}

const StatCard = ({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: any; sub?: string; color: string }) => (
  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="font-body text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-display text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      {sub && <p className="font-body text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const ChauffeurDashboard = () => {
  const { chauffeur } = useChauffeurAuth();
  const { t } = useLang();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chauffeurApi("/chauffeur/dashboard")
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
    </div>
  );

  // Fallback data if API isn't ready yet
  const s = stats || {
    taches: { total: 0, en_attente: 0, en_cours: 0, terminee: 0, confirmees: 0 },
    problemes: { total: 0, ouvert: 0, resolu: 0 },
    heures: { total_mois: 0, interventions_mois: 0 },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg shadow-emerald-600/20">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <Truck className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="font-body text-emerald-200 text-sm">{t("welcome")},</p>
            <h1 className="font-display text-2xl font-bold">
              {chauffeur?.prenom} {chauffeur?.nom}
            </h1>
            {chauffeur?.ambulance && (
              <p className="font-body text-emerald-200 text-sm mt-0.5">
                🚑 {chauffeur.ambulance.immatriculation}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ClipboardList} label={t("tasksAssigned")} value={s.taches.total}
          sub={`${s.taches.confirmees} ${t("confirmedByAdmin")}`} color="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
        <StatCard icon={TrendingUp} label={t("inProgressTasks")} value={s.taches.en_cours}
          sub={`${s.taches.en_attente} ${t("pendingTasks")}`} color="bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" />
        <StatCard icon={AlertTriangle} label={t("myReports")} value={s.problemes.total}
          sub={`${s.problemes.ouvert} ${t("openReports")}`} color="bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400" />
        <StatCard icon={Clock} label={t("hoursThisMonthDriver")} value={`${s.heures.total_mois}h`}
          sub={`${s.heures.interventions_mois} ${t("totalInterventions")}`} color="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" />
      </div>

      {/* Tasks overview */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <h2 className="font-display font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-emerald-600" /> {t("myTasks")}
          </h2>
          <div className="space-y-3">
            {[
              { label: t("pendingTasks"),   value: s.taches.en_attente, color: "bg-gray-200 dark:bg-gray-600",    bar: "bg-gray-400 dark:bg-gray-400" },
              { label: t("inProgressTasks"),value: s.taches.en_cours,   color: "bg-blue-100 dark:bg-blue-900/30", bar: "bg-blue-500" },
              { label: t("completedTasks"), value: s.taches.terminee,   color: "bg-emerald-100 dark:bg-emerald-900/30", bar: "bg-emerald-500" },
            ].map(({ label, value, color, bar }) => {
              const pct = s.taches.total > 0 ? Math.round((value / s.taches.total) * 100) : 0;
              return (
                <div key={label}>
                  <div className="flex justify-between font-body text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{label}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
                  </div>
                  <div className={`h-2 rounded-full ${color}`}>
                    <div className={`h-2 rounded-full ${bar} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <h2 className="font-display font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" /> {t("myProblems")}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: t("openReports"),   value: s.problemes.ouvert, color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400", ring: "ring-red-200 dark:ring-red-800" },
              { label: t("solvedReports"), value: s.problemes.resolu, color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-200 dark:ring-emerald-800" },
            ].map(({ label, value, color, ring }) => (
              <div key={label} className={`rounded-xl p-4 ring-1 ${ring} ${color} text-center`}>
                <p className="font-display text-3xl font-bold">{value}</p>
                <p className="font-body text-xs mt-1 opacity-80">{label}</p>
              </div>
            ))}
          </div>
          {s.problemes.total === 0 && (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mt-4">
              <CheckCircle className="h-4 w-4" />
              <span className="font-body text-sm">{t("noProblems")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChauffeurDashboard;
