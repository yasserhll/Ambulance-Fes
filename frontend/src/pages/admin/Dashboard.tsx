import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Ambulance,
  Wrench,
  AlertTriangle,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

interface DashboardData {
  flotte: {
    total: number;
    disponible: number;
    en_service: number;
    maintenance: number;
    hors_service: number;
  };
  maintenance: {
    planifiee: number;
    en_cours: number;
    terminee: number;
    cout_mois: number;
  };
  problemes: {
    ouvert: number;
    critique: number;
    en_cours: number;
    resolu: number;
  };
  heures: {
    total_heures_mois: number;
    total_interventions_mois: number;
  };
  dernieres_maintenances: any[];
  problemes_critiques: any[];
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) => (
  <div className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="font-body text-xs text-muted-foreground">{label}</p>
      <p className="font-display text-2xl font-bold text-foreground">{value}</p>
      {sub && <p className="font-body text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  </div>
);

const priorityBadge: Record<string, string> = {
  critique: "bg-destructive/10 text-destructive border-destructive/20",
  haute: "bg-orange-100 text-orange-700 border-orange-200",
  normale: "bg-blue-50 text-blue-700 border-blue-200",
  faible: "bg-muted text-muted-foreground border-border",
};

const statutMaintBadge: Record<string, string> = {
  terminee: "bg-green-100 text-green-700",
  en_cours: "bg-blue-100 text-blue-700",
  planifiee: "bg-yellow-100 text-yellow-700",
};

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard")
      .then((r) => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );

  if (!data) return <p className="text-destructive">Erreur de chargement.</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Tableau de Bord
        </h1>
        <p className="font-body text-sm text-muted-foreground mt-1">
          Vue d'ensemble de la flotte Ambulance Fès
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Ambulance}
          label="Véhicules totaux"
          value={data.flotte.total}
          sub={`${data.flotte.disponible} disponibles`}
          color="bg-primary/10 text-primary"
        />
        <StatCard
          icon={Wrench}
          label="Maintenances ce mois"
          value={data.maintenance.en_cours + data.maintenance.planifiee}
          sub={`${data.maintenance.cout_mois.toLocaleString("fr-MA")} MAD coût`}
          color="bg-orange-100 text-orange-600"
        />
        <StatCard
          icon={AlertTriangle}
          label="Problèmes ouverts"
          value={data.problemes.ouvert}
          sub={`${data.problemes.critique} critiques`}
          color="bg-destructive/10 text-destructive"
        />
        <StatCard
          icon={Clock}
          label="Heures ce mois"
          value={`${data.heures.total_heures_mois}h`}
          sub={`${data.heures.total_interventions_mois} interventions`}
          color="bg-green-100 text-green-600"
        />
      </div>

      {/* Flotte statuts */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="font-display font-semibold text-foreground mb-4">
          État de la Flotte
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Disponible", value: data.flotte.disponible, color: "bg-green-500" },
            { label: "En service", value: data.flotte.en_service, color: "bg-blue-500" },
            { label: "Maintenance", value: data.flotte.maintenance, color: "bg-yellow-500" },
            { label: "Hors service", value: data.flotte.hors_service, color: "bg-red-500" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div
                className={`w-12 h-12 rounded-full ${s.color} flex items-center justify-center text-white font-display font-bold text-lg mx-auto`}
              >
                {s.value}
              </div>
              <p className="font-body text-xs text-muted-foreground mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Dernières maintenances */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Wrench className="h-4 w-4 text-primary" /> Dernières Maintenances
          </h2>
          <div className="space-y-3">
            {data.dernieres_maintenances.length === 0 && (
              <p className="font-body text-sm text-muted-foreground">Aucune maintenance.</p>
            )}
            {data.dernieres_maintenances.map((m: any) => (
              <div key={m.id} className="flex items-start justify-between gap-3 py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-body text-sm font-medium text-foreground">
                    {m.ambulance?.immatriculation} — {m.description}
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    {m.garage || "—"} · {m.date_debut}
                  </p>
                </div>
                <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded-lg ${statutMaintBadge[m.statut]}`}>
                  {m.statut}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Problèmes critiques */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" /> Problèmes Prioritaires
          </h2>
          <div className="space-y-3">
            {data.problemes_critiques.length === 0 && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="font-body text-sm">Aucun problème critique.</span>
              </div>
            )}
            {data.problemes_critiques.map((p: any) => (
              <div key={p.id} className="flex items-start justify-between gap-3 py-2 border-b border-border last:border-0">
                <div>
                  <p className="font-body text-sm font-medium text-foreground">{p.titre}</p>
                  <p className="font-body text-xs text-muted-foreground">
                    {p.ambulance?.immatriculation} · {p.date_rapport}
                  </p>
                </div>
                <span className={`shrink-0 text-xs font-medium px-2 py-1 rounded-lg border ${priorityBadge[p.priorite]}`}>
                  {p.priorite}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
