import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useLang } from "@/contexts/AppContexts";
import { Ambulance, Wrench, AlertTriangle, Clock, CheckCircle, Loader2, Users, TrendingUp } from "lucide-react";

interface DashboardData {
  flotte: { total: number; disponible: number; en_service: number; maintenance: number; hors_service: number };
  maintenance: { planifiee: number; en_cours: number; terminee: number; cout_mois: number };
  problemes: { ouvert: number; critique: number; en_cours: number; resolu: number };
  heures: { total_heures_mois: number; total_interventions_mois: number };
  chauffeurs_actifs: number;
  dernieres_maintenances: any[];
  problemes_critiques: any[];
}

const StatCard = ({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: any; sub?: string; color: string }) => (
  <div className="bg-card dark:bg-gray-800 border border-border dark:border-gray-700 rounded-2xl p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="font-body text-xs text-muted-foreground">{label}</p>
      <p className="font-display text-2xl font-bold text-foreground dark:text-white">{value}</p>
      {sub && <p className="font-body text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  </div>
);

const priorityBadge: Record<string, string> = {
  critique: "bg-destructive/10 text-destructive border-destructive/20",
  haute:    "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
  normale:  "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  faible:   "bg-muted text-muted-foreground border-border",
};

const statutMaintBadge: Record<string, string> = {
  terminee:  "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  en_cours:  "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  planifiee: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
};

const Dashboard = () => {
  const { t } = useLang();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard").then(r => setData(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
  if (!data) return <p className="text-destructive">{t("error")}</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground dark:text-white">{t("dashboard")}</h1>
        <p className="font-body text-sm text-muted-foreground mt-1">Vue d'ensemble — Ambulance Fès</p>
      </div>

      {/* KPI Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Ambulance}     label={t("totalVehicles")}       value={data.flotte.total}     sub={`${data.flotte.disponible} ${t("available")}`}       color="bg-primary/10 text-primary" />
        <StatCard icon={Wrench}        label={t("maintenanceThisMonth")} value={data.maintenance.en_cours + data.maintenance.planifiee} sub={`${data.maintenance.cout_mois?.toLocaleString("fr-MA") || 0} MAD`} color="bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400" />
        <StatCard icon={AlertTriangle} label={t("openProblems")}         value={data.problemes.ouvert} sub={`${data.problemes.critique} ${t("criticals")}`}       color="bg-destructive/10 text-destructive" />
        <StatCard icon={Clock}         label={t("hoursThisMonth")}       value={`${data.heures.total_heures_mois}h`} sub={`${data.heures.total_interventions_mois} ${t("interventions")}`} color="bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400" />
      </div>

      {/* Fleet status */}
      <div className="bg-card dark:bg-gray-800 border border-border dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <h2 className="font-display font-semibold text-foreground dark:text-white mb-5">{t("fleetStatus")}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { label: t("disponible"),       value: data.flotte.disponible,   color: "bg-green-500",  ring: "ring-green-200 dark:ring-green-800" },
            { label: t("enService"),        value: data.flotte.en_service,   color: "bg-blue-500",   ring: "ring-blue-200 dark:ring-blue-800" },
            { label: t("maintenanceStatus"),value: data.flotte.maintenance,  color: "bg-yellow-500", ring: "ring-yellow-200 dark:ring-yellow-800" },
            { label: t("horsService"),      value: data.flotte.hors_service, color: "bg-red-500",    ring: "ring-red-200 dark:ring-red-800" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className={`w-14 h-14 rounded-2xl ${s.color} ring-4 ${s.ring} flex items-center justify-center text-white font-display font-bold text-xl mx-auto shadow-md`}>
                {s.value}
              </div>
              <p className="font-body text-sm text-muted-foreground mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Problems overview */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: t("open"),       value: data.problemes.ouvert,   icon: AlertTriangle, cls: "text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400" },
          { label: t("inProgress"), value: data.problemes.en_cours, icon: TrendingUp,    cls: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400" },
          { label: t("resolved"),   value: data.problemes.resolu,   icon: CheckCircle,   cls: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400" },
        ].map(({ label, value, icon: Icon, cls }) => (
          <div key={label} className={`rounded-2xl p-5 flex items-center gap-4 ${cls}`}>
            <Icon className="h-8 w-8 opacity-70" />
            <div>
              <p className="font-display text-3xl font-bold">{value}</p>
              <p className="font-body text-sm opacity-80">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Dernières maintenances */}
        <div className="bg-card dark:bg-gray-800 border border-border dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <h2 className="font-display font-semibold text-foreground dark:text-white mb-4 flex items-center gap-2">
            <Wrench className="h-4 w-4 text-primary" /> {t("lastMaintenances")}
          </h2>
          <div className="space-y-3">
            {data.dernieres_maintenances.length === 0 && (
              <p className="font-body text-sm text-muted-foreground">{t("noMaintenance")}</p>
            )}
            {data.dernieres_maintenances.map((m: any) => (
              <div key={m.id} className="flex items-start justify-between gap-3 py-2 border-b border-border dark:border-gray-700 last:border-0">
                <div>
                  <p className="font-body text-sm font-medium text-foreground dark:text-white">
                    {m.ambulance?.immatriculation} — {m.description}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">{m.garage || "—"} · {m.date_debut}</p>
                </div>
                <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded-lg ${statutMaintBadge[m.statut]}`}>{m.statut}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Problèmes critiques */}
        <div className="bg-card dark:bg-gray-800 border border-border dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <h2 className="font-display font-semibold text-foreground dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" /> {t("priorityProblems")}
          </h2>
          <div className="space-y-3">
            {data.problemes_critiques.length === 0 && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                <span className="font-body text-sm">{t("noCritical")}</span>
              </div>
            )}
            {data.problemes_critiques.map((p: any) => (
              <div key={p.id} className="flex items-start justify-between gap-3 py-2 border-b border-border dark:border-gray-700 last:border-0">
                <div>
                  <p className="font-body text-sm font-medium text-foreground dark:text-white">{p.titre}</p>
                  <p className="font-body text-xs text-muted-foreground">{p.ambulance?.immatriculation} · {p.date_rapport}</p>
                </div>
                <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded-lg border ${priorityBadge[p.priorite]}`}>{p.priorite}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
