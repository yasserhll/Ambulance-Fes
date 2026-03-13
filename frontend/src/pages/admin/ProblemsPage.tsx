import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Plus, X, CheckCircle, Bug, CarFront, Wrench } from "lucide-react";
import { getAmbulances, updateAmbulance, type Ambulance, type Problem } from "@/lib/ambulanceData";

const typeIcons = { panne: Bug, maintenance: Wrench, accident: CarFront };
const typeColors = { panne: "text-destructive bg-destructive/10", maintenance: "text-warning bg-warning/10", accident: "text-primary bg-primary/10" };

const ProblemsPage = () => {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [showForm, setShowForm] = useState<string | null>(null);
  const [desc, setDesc] = useState("");
  const [type, setType] = useState<Problem["type"]>("panne");

  useEffect(() => { setAmbulances(getAmbulances()); }, []);

  const addProblem = (ambId: string) => {
    const amb = ambulances.find((a) => a.id === ambId);
    if (!amb || !desc.trim()) return;
    const newProblem: Problem = {
      id: Date.now().toString(),
      description: desc,
      date: new Date().toISOString().split("T")[0],
      resolved: false,
      type,
    };
    setAmbulances(updateAmbulance(ambId, { problems: [...amb.problems, newProblem], status: type === "panne" ? "en_panne" : amb.status }));
    setDesc("");
    setShowForm(null);
  };

  const toggleResolved = (ambId: string, problemId: string) => {
    const amb = ambulances.find((a) => a.id === ambId);
    if (!amb) return;
    const updated = amb.problems.map((p) => p.id === problemId ? { ...p, resolved: !p.resolved } : p);
    setAmbulances(updateAmbulance(ambId, { problems: updated }));
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-2 w-8 bg-primary rounded-full" />
          <span className="font-body text-xs text-muted-foreground uppercase tracking-widest font-semibold">Incidents</span>
        </div>
        <h1 className="font-display text-3xl font-bold text-foreground">Gestion des Problèmes</h1>
        <p className="font-body text-muted-foreground mt-1">Déclarez et suivez les pannes et incidents</p>
      </motion.div>

      <div className="space-y-5">
        {ambulances.map((amb) => (
          <motion.div key={amb.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            {/* Ambulance header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-foreground">{amb.name}</h3>
                  <span className="font-mono text-xs text-muted-foreground">{amb.plate}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-body text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">
                  {amb.problems.filter(p => !p.resolved).length} actif(s)
                </span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowForm(showForm === amb.id ? null : amb.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-primary-foreground bg-primary px-4 py-2 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" /> Déclarer
                </motion.button>
              </div>
            </div>

            {/* Add form */}
            <AnimatePresence>
              {showForm === amb.id && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-muted/50 p-5 space-y-4 border-b border-border">
                    <div className="flex gap-3">
                      <input
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        placeholder="Description du problème..."
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-border bg-card font-body text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                      />
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as Problem["type"])}
                        className="px-4 py-3 rounded-xl border-2 border-border bg-card font-body text-sm focus:outline-none focus:border-primary transition-all"
                      >
                        <option value="panne">🔧 Panne</option>
                        <option value="maintenance">⚙️ Maintenance</option>
                        <option value="accident">🚗 Accident</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => addProblem(amb.id)} className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm">
                        Enregistrer
                      </button>
                      <button onClick={() => setShowForm(null)} className="px-5 py-2.5 rounded-xl border-2 border-border text-muted-foreground text-xs font-medium hover:text-foreground transition-colors">
                        Annuler
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Problems list */}
            <div className="p-5">
              {amb.problems.length === 0 ? (
                <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span className="font-body text-sm">Aucun problème signalé — Tout est en ordre</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {amb.problems.map((problem) => {
                    const TypeIcon = typeIcons[problem.type];
                    const colorClass = typeColors[problem.type];
                    return (
                      <div
                        key={problem.id}
                        className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                          problem.resolved
                            ? "bg-accent/5 border border-accent/20"
                            : "bg-card border border-border hover:border-primary/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${problem.resolved ? "bg-accent/10 text-accent" : colorClass}`}>
                            {problem.resolved ? <CheckCircle className="h-4 w-4" /> : <TypeIcon className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className={`font-body text-sm font-medium ${problem.resolved ? "text-muted-foreground line-through" : "text-foreground"}`}>
                              {problem.description}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-body text-[11px] text-muted-foreground">{problem.date}</span>
                              <span className="text-muted-foreground/30">•</span>
                              <span className="font-body text-[11px] text-muted-foreground capitalize">{problem.type}</span>
                            </div>
                          </div>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleResolved(amb.id, problem.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                            problem.resolved
                              ? "bg-muted text-foreground hover:bg-muted/80"
                              : "bg-accent text-accent-foreground shadow-sm hover:opacity-90"
                          }`}
                        >
                          {problem.resolved ? "Rouvrir" : "✓ Résolu"}
                        </motion.button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProblemsPage;
