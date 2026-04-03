import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Plus, Pencil, Trash2, Loader2, X, Check, Search } from "lucide-react";

type Statut = "disponible" | "en_service" | "maintenance" | "hors_service";

interface Ambulance {
  id: number;
  immatriculation: string;
  marque: string;
  modele: string;
  annee: number;
  statut: Statut;
  notes: string | null;
}

const statutColors: Record<Statut, string> = {
  disponible:   "bg-green-100 text-green-700 border-green-200",
  en_service:   "bg-blue-100 text-blue-700 border-blue-200",
  maintenance:  "bg-yellow-100 text-yellow-700 border-yellow-200",
  hors_service: "bg-red-100 text-red-700 border-red-200",
};

const statutLabels: Record<Statut, string> = {
  disponible:   "Disponible",
  en_service:   "En Service",
  maintenance:  "Maintenance",
  hors_service: "Hors Service",
};

const typeOptions = [
  "Type A – Transport sanitaire",
  "Type B – Urgence médicale",
  "Type C – Réanimation",
  "VSAV – Secours à victimes",
  "Ambulance pédiatrique",
  "Ambulance bariatrique",
  "Autre",
];

const emptyForm = {
  immatriculation: "",
  marque: typeOptions[0],
  modele: "N/A",
  annee: new Date().getFullYear(),
  statut: "disponible" as Statut,
  conducteur: "",
  telephone_conducteur: "",
  kilometrage: 0,
  derniere_revision: "",
  prochaine_revision: "",
  notes: "",
};

const FleetManagement = () => {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Ambulance | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = () => {
    setLoading(true);
    const params: any = {};
    if (search) params.search = search;
    if (filterStatut) params.statut = filterStatut;
    api.get("/ambulances", { params })
      .then((r) => setAmbulances(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [search, filterStatut]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(""); setShowModal(true); };

  const openEdit = (a: Ambulance) => {
    setEditing(a);
    setForm({ immatriculation: a.immatriculation, marque: a.marque, modele: a.modele || "N/A", annee: a.annee, statut: a.statut, conducteur: "", telephone_conducteur: "", kilometrage: 0, derniere_revision: "", prochaine_revision: "", notes: a.notes || "" });
    setError(""); setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      editing ? await api.put(`/ambulances/${editing.id}`, form) : await api.post("/ambulances", form);
      setShowModal(false); fetchData();
    } catch (e: any) {
      const errs = e?.response?.data?.errors;
      setError(errs ? Object.values(errs).flat().join(" ") : e?.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette ambulance ?")) return;
    await api.delete(`/ambulances/${id}`); fetchData();
  };

  const counts = ambulances.reduce((acc, a) => { acc[a.statut] = (acc[a.statut] || 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Gestion des Ambulances</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">{ambulances.length} ambulance(s)</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-body text-sm font-semibold hover:bg-primary/90 transition">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.entries(statutLabels) as [Statut, string][]).map(([key, label]) => (
          <div key={key} className="bg-card border border-border rounded-2xl p-4">
            <p className="font-body text-xs text-muted-foreground mb-1">{label}</p>
            <p className={`font-display text-2xl font-bold ${statutColors[key].split(" ")[1]}`}>{counts[key] || 0}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par matricule..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="px-3 py-2.5 rounded-xl border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="">Tous les statuts</option>
          {Object.entries(statutLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {["Matricule", "Type d'Ambulance", "Équipement", "Statut", "Actions"].map((h) => (
                    <th key={h} className="text-left font-body text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ambulances.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-12 font-body text-muted-foreground">Aucune ambulance trouvée.</td></tr>
                )}
                {ambulances.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition">
                    <td className="px-4 py-3 font-body text-sm font-bold text-foreground">{a.immatriculation}</td>
                    <td className="px-4 py-3 font-body text-sm text-foreground">{a.marque}</td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground max-w-[200px]">
                      <span className="line-clamp-2">{a.notes || "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-lg border ${statutColors[a.statut]}`}>
                        {statutLabels[a.statut]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-display font-bold text-lg text-foreground">{editing ? "Modifier l'ambulance" : "Ajouter une ambulance"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-muted transition"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Matricule *</label>
                <input type="text" value={form.immatriculation} onChange={(e) => setForm({ ...form, immatriculation: e.target.value })} placeholder="ex: 1234-A-5" className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Type d'ambulance *</label>
                <select value={form.marque} onChange={(e) => setForm({ ...form, marque: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Statut *</label>
                <select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value as Statut })} className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {Object.entries(statutLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Équipement</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={4} placeholder="ex: Défibrillateur, Oxygène, Civière, Moniteur cardiaque..." className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
            </div>
            {error && <div className="mx-6 mb-4 bg-destructive/10 text-destructive rounded-xl px-4 py-3 font-body text-sm">{error}</div>}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-border font-body text-sm hover:bg-muted transition">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-body text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {editing ? "Enregistrer" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetManagement;
