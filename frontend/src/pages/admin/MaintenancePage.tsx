import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplets, AlertCircle, CheckCircle, Gauge } from "lucide-react";
import { getAmbulances, updateAmbulance, getKmUntilOilChange, type Ambulance } from "@/lib/ambulanceData";
import { Progress } from "@/components/ui/progress";

const MaintenancePage = () => {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);

  useEffect(() => { setAmbulances(getAmbulances()); }, []);

  const handleOilChange = (amb: Ambulance) => {
    setAmbulances(updateAmbulance(amb.id, { lastOilChange: amb.currentKm }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-2 w-8 bg-primary rounded-full" />
          <span className="font-body text-xs text-muted-foreground uppercase tracking-widest font-semibold">Maintenance</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">Maintenance & Vidanges</h1>
        <p className="font-body text-muted-foreground mt-1">Suivez les vidanges et l'entretien de chaque ambulance</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-5">
        {ambulances.map((amb, i) => {
          const kmLeft = getKmUntilOilChange(amb);
          const progressPercent = Math.max(0, Math.min(100, ((amb.oilChangeInterval - kmLeft) / amb.oilChangeInterval) * 100));
          const isUrgent = kmLeft <= 500;
          const isWarning = kmLeft <= 1500;

          return (
            <motion.div
              key={amb.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-card rounded-2xl border-2 p-6 shadow-sm transition-all hover:shadow-md ${
                isUrgent ? "border-destructive/40" : isWarning ? "border-warning/40" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${isUrgent ? "bg-destructive/10" : isWarning ? "bg-warning/10" : "bg-accent/10"}`}>
                    <Droplets className={`h-5 w-5 ${isUrgent ? "text-destructive" : isWarning ? "text-warning" : "text-accent"}`} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">{amb.name}</h3>
                    <span className="font-mono text-xs text-muted-foreground">{amb.plate}</span>
                  </div>
                </div>
                {isUrgent ? (
                  <span className="flex items-center gap-1.5 bg-destructive/10 text-destructive text-xs font-semibold px-3 py-1.5 rounded-lg">
                    <AlertCircle className="h-3.5 w-3.5" /> Urgente
                  </span>
                ) : isWarning ? (
                  <span className="flex items-center gap-1.5 bg-warning/10 text-warning text-xs font-semibold px-3 py-1.5 rounded-lg">
                    <AlertCircle className="h-3.5 w-3.5" /> Bientôt
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 bg-accent/10 text-accent text-xs font-semibold px-3 py-1.5 rounded-lg">
                    <CheckCircle className="h-3.5 w-3.5" /> OK
                  </span>
                )}
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 mb-4 text-xs font-body text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Gauge className="h-3.5 w-3.5" />
                  <span>{amb.currentKm} km actuels</span>
                </div>
                <span>•</span>
                <span>Dernière: {amb.lastOilChange} km</span>
              </div>

              <Progress value={progressPercent} className="h-3 rounded-full mb-3" />
              <div className="flex items-center justify-between">
                <span className={`font-display text-lg font-bold ${isUrgent ? "text-destructive" : isWarning ? "text-warning" : "text-accent"}`}>
                  {kmLeft > 0 ? `${kmLeft} km restants` : "Dépassée!"}
                </span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleOilChange(amb)}
                  className="px-4 py-2 rounded-xl bg-accent text-accent-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
                >
                  ✓ Vidange effectuée
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MaintenancePage;
