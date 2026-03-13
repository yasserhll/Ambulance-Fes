import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Edit2, Check, X, Timer } from "lucide-react";
import { getAmbulances, updateAmbulance, type Ambulance } from "@/lib/ambulanceData";

const WorkHoursPage = () => {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hours, setHours] = useState(0);

  useEffect(() => { setAmbulances(getAmbulances()); }, []);

  const saveHours = (id: string) => {
    setAmbulances(updateAmbulance(id, { totalHours: hours }));
    setEditingId(null);
  };

  const maxHours = Math.max(...ambulances.map(a => a.totalHours), 1);

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-2 w-8 bg-primary rounded-full" />
          <span className="font-body text-xs text-muted-foreground uppercase tracking-widest font-semibold">Temps de travail</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">Heures de Travail</h1>
        <p className="font-body text-muted-foreground mt-1">Suivez le temps de travail de chaque ambulance</p>
      </motion.div>

      {/* Summary card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl bg-secondary/10">
            <Timer className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground">Total heures flotte</h3>
            <span className="font-body text-xs text-muted-foreground">{ambulances.length} ambulances</span>
          </div>
          <div className="ml-auto text-right">
            <span className="font-display text-3xl font-bold text-foreground">{ambulances.reduce((s, a) => s + a.totalHours, 0)}</span>
            <span className="font-body text-sm text-muted-foreground ml-1">heures</span>
          </div>
        </div>
      </motion.div>

      <div className="space-y-3">
        {ambulances.map((amb, i) => {
          const barWidth = (amb.totalHours / maxHours) * 100;
          return (
            <motion.div
              key={amb.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md hover:border-primary/10 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">{amb.name}</h3>
                    <p className="font-mono text-xs text-muted-foreground">{amb.plate} — depuis {amb.createdAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {editingId === amb.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={hours}
                        onChange={(e) => setHours(+e.target.value)}
                        className="w-24 px-3 py-2 rounded-xl border-2 border-primary bg-card font-body text-sm text-right focus:outline-none focus:ring-4 focus:ring-primary/10"
                        autoFocus
                      />
                      <span className="font-body text-sm text-muted-foreground">h</span>
                      <button onClick={() => saveHours(amb.id)} className="p-2 rounded-xl bg-accent text-accent-foreground hover:opacity-90 transition-opacity shadow-sm">
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={() => setEditingId(null)} className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="text-right">
                        <span className="font-display text-2xl font-bold text-foreground">{amb.totalHours}</span>
                        <span className="font-body text-sm text-muted-foreground ml-1">heures</span>
                      </div>
                      <button
                        onClick={() => { setEditingId(amb.id); setHours(amb.totalHours); }}
                        className="p-2 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Visual bar */}
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05 }}
                  className="h-full bg-gradient-to-r from-secondary to-primary rounded-full"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkHoursPage;
