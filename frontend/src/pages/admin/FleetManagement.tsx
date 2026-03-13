import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X, Ambulance, Gauge, Calendar } from "lucide-react";
import {
  getAmbulances, addAmbulance, updateAmbulance, deleteAmbulance,
  getStatusLabel, getStatusColor, getKmUntilOilChange, type Ambulance as AmbulanceType,
} from "@/lib/ambulanceData";

const FleetManagement = () => {
  const [ambulances, setAmbulances] = useState<AmbulanceType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", plate: "", status: "disponible" as AmbulanceType["status"], totalHours: 0, lastOilChange: 0, currentKm: 0, oilChangeInterval: 5000 });

  useEffect(() => { setAmbulances(getAmbulances()); }, []);

  const resetForm = () => {
    setForm({ name: "", plate: "", status: "disponible", totalHours: 0, lastOilChange: 0, currentKm: 0, oilChangeInterval: 5000 });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setAmbulances(updateAmbulance(editingId, form));
    } else {
      setAmbulances(addAmbulance(form));
    }
    resetForm();
  };

  const handleEdit = (amb: AmbulanceType) => {
    setForm({ name: amb.name, plate: amb.plate, status: amb.status, totalHours: amb.totalHours, lastOilChange: amb.lastOilChange, currentKm: amb.currentKm, oilChangeInterval: amb.oilChangeInterval });
    setEditingId(amb.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette ambulance?")) {
      setAmbulances(deleteAmbulance(id));
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-border bg-card font-body text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all";

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="h-2 w-8 bg-primary rounded-full" />
            <span className="font-body text-xs text-muted-foreground uppercase tracking-widest font-semibold">Flotte</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground">Gestion de la Flotte</h1>
          <p className="font-body text-muted-foreground mt-1">Ajoutez, modifiez et gérez vos ambulances</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-primary text-primary-foreground font-display font-semibold text-sm px-5 py-3 rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
        >
          <Plus className="h-4 w-4" /> Ajouter
        </motion.button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-card rounded-2xl border-2 border-primary/20 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Ambulance className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{editingId ? "Modifier" : "Nouvelle"} Ambulance</h3>
                </div>
                <button onClick={resetForm} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Nom</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputClass} placeholder="Ambulance A" />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Plaque</label>
                  <input value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} required className={inputClass} placeholder="12345-A-1" />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Statut</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as AmbulanceType["status"] })} className={inputClass}>
                    <option value="disponible">Disponible</option>
                    <option value="en_mission">En Mission</option>
                    <option value="en_panne">En Panne</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Heures totales</label>
                  <input type="number" value={form.totalHours} onChange={(e) => setForm({ ...form, totalHours: +e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Km actuel</label>
                  <input type="number" value={form.currentKm} onChange={(e) => setForm({ ...form, currentKm: +e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Dernière vidange (km)</label>
                  <input type="number" value={form.lastOilChange} onChange={(e) => setForm({ ...form, lastOilChange: +e.target.value })} className={inputClass} />
                </div>
                <div className="sm:col-span-2 lg:col-span-3 flex gap-3 pt-2">
                  <motion.button whileTap={{ scale: 0.97 }} type="submit" className="flex items-center gap-2 bg-primary text-primary-foreground font-display font-semibold text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all">
                    {editingId ? "Mettre à jour" : "Ajouter l'ambulance"}
                  </motion.button>
                  <button type="button" onClick={resetForm} className="px-6 py-3 rounded-xl border-2 border-border font-display font-medium text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all">
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {ambulances.map((amb, i) => {
          const kmLeft = getKmUntilOilChange(amb);
          return (
            <motion.div
              key={amb.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md hover:border-primary/10 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                    <Ambulance className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">{amb.name}</h3>
                    <p className="font-mono text-xs text-muted-foreground">{amb.plate}</p>
                  </div>
                </div>
                <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-primary-foreground ${getStatusColor(amb.status)}`}>
                  {getStatusLabel(amb.status)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-muted rounded-xl p-3 text-center">
                  <Gauge className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                  <span className="font-display text-sm font-bold text-foreground block">{amb.currentKm}</span>
                  <span className="font-body text-[10px] text-muted-foreground">km</span>
                </div>
                <div className="bg-muted rounded-xl p-3 text-center">
                  <Calendar className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
                  <span className="font-display text-sm font-bold text-foreground block">{amb.totalHours}h</span>
                  <span className="font-body text-[10px] text-muted-foreground">travail</span>
                </div>
                <div className={`rounded-xl p-3 text-center ${kmLeft <= 500 ? "bg-destructive/10" : kmLeft <= 1500 ? "bg-warning/10" : "bg-accent/10"}`}>
                  <span className={`font-display text-sm font-bold block ${kmLeft <= 500 ? "text-destructive" : kmLeft <= 1500 ? "text-warning" : "text-accent"}`}>{kmLeft > 0 ? kmLeft : "⚠️"}</span>
                  <span className="font-body text-[10px] text-muted-foreground">km vidange</span>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(amb)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-muted hover:bg-secondary/10 text-muted-foreground hover:text-secondary text-xs font-medium transition-all">
                  <Edit2 className="h-3.5 w-3.5" /> Modifier
                </button>
                <button onClick={() => handleDelete(amb.id)} className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-muted hover:bg-destructive/10 text-muted-foreground hover:text-destructive text-xs font-medium transition-all">
                  <Trash2 className="h-3.5 w-3.5" /> Supprimer
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FleetManagement;
