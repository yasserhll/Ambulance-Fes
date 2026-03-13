import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Ambulance as AmbulanceIcon, Activity, AlertTriangle, Wrench, TrendingUp, ChevronRight } from "lucide-react";
import { getAmbulances, getAvailabilityRate, getKmUntilOilChange, getStatusLabel, getStatusColor, type Ambulance } from "@/lib/ambulanceData";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" as const } }),
};

const Dashboard = () => {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);

  useEffect(() => {
    setAmbulances(getAmbulances());
  }, []);

  const availabilityRate = getAvailabilityRate(ambulances);
  const activeCount = ambulances.filter((a) => a.status === "en_mission").length;
  const problemCount = ambulances.reduce((acc, a) => acc + a.problems.filter((p) => !p.resolved).length, 0);
  const maintenanceCount = ambulances.filter((a) => a.status === "maintenance").length;

  const stats = [
    { icon: TrendingUp, label: "Taux Disponibilité", value: `${availabilityRate}%`, color: "text-accent", bgColor: "bg-accent/10", link: "/admin/fleet" },
    { icon: AmbulanceIcon, label: "En Mission", value: activeCount.toString(), color: "text-primary", bgColor: "bg-primary/10", link: "/admin/fleet" },
    { icon: AlertTriangle, label: "Problèmes Actifs", value: problemCount.toString(), color: "text-destructive", bgColor: "bg-destructive/10", link: "/admin/problems" },
    { icon: Wrench, label: "En Maintenance", value: maintenanceCount.toString(), color: "text-warning", bgColor: "bg-warning/10", link: "/admin/maintenance" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-2 w-8 bg-primary rounded-full" />
          <span className="font-body text-xs text-muted-foreground uppercase tracking-widest font-semibold">Dashboard</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">Tableau de Bord</h1>
        <p className="font-body text-muted-foreground mt-1">Vue d'ensemble de votre flotte d'ambulances</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariant}
          >
            <Link to={stat.link} className="block bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <div className="font-display text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <span className="font-body text-sm text-muted-foreground">{stat.label}</span>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Availability */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-8"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg font-semibold text-foreground">Disponibilité Globale</h3>
          <span className={`font-display text-2xl font-bold ${availabilityRate >= 70 ? "text-accent" : availabilityRate >= 40 ? "text-warning" : "text-destructive"}`}>
            {availabilityRate}%
          </span>
        </div>
        <Progress value={availabilityRate} className="h-3 rounded-full" />
        <div className="flex justify-between mt-3">
          <span className="font-body text-xs text-muted-foreground">{ambulances.filter(a => a.status === "disponible").length} disponibles</span>
          <span className="font-body text-xs text-muted-foreground">{ambulances.length} au total</span>
        </div>
      </motion.div>

      {/* Fleet Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
      >
        <div className="p-6 pb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-foreground">Aperçu de la Flotte</h3>
          <Link to="/admin/fleet" className="font-body text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors">
            Voir tout <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full font-body text-sm">
            <thead>
              <tr className="border-y border-border bg-muted/50">
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">Ambulance</th>
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">Plaque</th>
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">Heures</th>
                <th className="px-6 py-3 text-left font-semibold text-muted-foreground text-xs uppercase tracking-wider">Prochaine Vidange</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ambulances.map((amb) => {
                const kmLeft = getKmUntilOilChange(amb);
                return (
                  <tr key={amb.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">{amb.name}</td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{amb.plate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary-foreground ${getStatusColor(amb.status)}`}>
                        <Activity className="h-3 w-3" />
                        {getStatusLabel(amb.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-medium">{amb.totalHours}h</td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${kmLeft <= 500 ? "text-destructive" : kmLeft <= 1500 ? "text-warning" : "text-accent"}`}>
                        {kmLeft > 0 ? `${kmLeft} km` : "⚠️ Dépassée!"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
