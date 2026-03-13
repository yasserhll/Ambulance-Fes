import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Plus, Pencil, Trash2, Loader2, X, Check } from "lucide-react";

interface Probleme {
  id: number;
  ambulance_id: number;
  ambulance?: { id: number; immatriculation: string };
  titre: string;
  description: string;
  priorite: string;
  statut: string;
  rapporte_par: string | null;
  date_rapport: string;
  date_resolution: string | null;
  solution: string | null;
}

interface Ambulance { id: number; immatriculation: string; }

const priorityColors: Record<string, string> = {
  critique: "bg-red-100 text-red-700 border-red-200",
  haute:    "bg-orange-100 text-orange-700 border-orange-200",
  normale:  "bg-blue-50 text-blue-700 border-blue-200",
  faible:   "bg-muted text-muted-foreground border-border",
};

const statutColors: Record<string, string> = {
  ouvert:   "bg-red-100 text-red-700",
  en_cours: "bg-blue-100 text-blue-700",
  resolu:   "bg-green-100 text-green-700",
  ferme:    "bg-muted text-muted-foreground",
};

const emptyForm = {
  ambulance_id: "",
  titre: "",
  description: "",
  priorite: "normale",
  statut: "ouvert",
  rapporte_par: "",
  date_rapport: new Date().toISOString().split("T")[0],
  date_resolution: "",
  solution: "",
};

const ProblemsPage = () => {
  const [problemes, setProblemes] = useState<Probleme[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatut, setFilterStatut] = useState("");
  const [filterPriorite, setFilterPriorite] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Probleme | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = () => {
    setLoading(true);
    const params: any = {};
    if (filterStatut) params.statut = filterStatut;
    if (filterPriorite) params.priorite = filterPriorite;
    Promise.all([
      api.get("/problems", { params }),
      api.get("/ambulances"),
    ])
      .then(([p, a]) => { setProblemes(p.data); setAmbulances(a.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [filterStatut, filterPriorite]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(""); setShowModal(true); };

  const openEdit = (p: Probleme) => {
    setEditing(p);
    setForm({
      ambulance_id: String(p.ambulance_id),
      titre: p.titre,
      description: p.description,
      priorite: p.priorite,
      statut: p.statut,
      rapporte_par: p.rapporte_par || "",
      date_rapport: p.date_rapport,
      date_resolution: p.date_resolution || "",
      solution: p.solution || "",
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      editing
        ? await api.put(`/problems/${editing.id}`, form)
        : await api.post("/problems", form);
      setShowModal(false);
      fetchData();
    } catch (e: any) {
      const errs = e?.response?.data?.errors;
      setError(errs ? Object.values(errs).flat().join(" ") : e?.response?.data?.message || "Erreur.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce problème ?")) return;
    await api.delete(`/problems/${id}`);
    fetchData();
  };

  const f = (key: string) => (e: React.ChangeEvent<any>) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Problèmes</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">{problemes.length} problème(s)</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-body text-sm font-semibold hover:bg-primary/90 transition">
          <Plus className="h-4 w-4" /> Signaler
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="">Tous les statuts</option>
          <option value="ouvert">Ouvert</option>
          <option value="en_cours">En cours</option>
          <option value="resolu">Résolu</option>
          <option value="ferme">Fermé</option>
        </select>
        <select value={filterPriorite} onChange={(e) => setFilterPriorite(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="">Toutes priorités</option>
          <option value="critique">Critique</option>
          <option value="haute">Haute</option>
          <option value="normale">Normale</option>
          <option value="faible">Faible</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-3">
          {problemes.length === 0 && (
            <div className="bg-card border border-border rounded-2xl p-12 text-center font-body text-muted-foreground">
              Aucun problème trouvé.
            </div>
          )}
          {problemes.map((p) => (
            <div key={p.id} className="bg-card border border-border rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-primary/20 transition">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-lg border ${priorityColors[p.priorite]}`}>{p.priorite}</span>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-lg ${statutColors[p.statut]}`}>{p.statut}</span>
                  <span className="font-body text-xs text-muted-foreground">{p.ambulance?.immatriculation}</span>
                </div>
                <h3 className="font-display font-semibold text-foreground truncate">{p.titre}</h3>
                <p className="font-body text-sm text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-3 mt-2 font-body text-xs text-muted-foreground">
                  {p.rapporte_par && <span>Par: {p.rapporte_par}</span>}
                  <span>Signalé: {p.date_rapport}</span>
                  {p.date_resolution && <span>Résolu: {p.date_resolution}</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(p)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(p.id)} className="p-2 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-display font-bold text-lg">{editing ? "Modifier" : "Signaler"} un problème</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-muted transition"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Ambulance *</label>
                <select value={form.ambulance_id} onChange={f("ambulance_id")}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">-- Choisir --</option>
                  {ambulances.map((a) => <option key={a.id} value={a.id}>{a.immatriculation}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Priorité *</label>
                <select value={form.priorite} onChange={f("priorite")}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="faible">Faible</option>
                  <option value="normale">Normale</option>
                  <option value="haute">Haute</option>
                  <option value="critique">Critique</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Titre *</label>
                <input value={form.titre} onChange={f("titre")}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Description *</label>
                <textarea value={form.description} onChange={f("description")} rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              {[
                { label: "Rapporté par", key: "rapporte_par", type: "text" },
                { label: "Date rapport *", key: "date_rapport", type: "date" },
                { label: "Date résolution", key: "date_resolution", type: "date" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block font-body text-xs font-medium text-muted-foreground mb-1">{label}</label>
                  <input type={type} value={(form as any)[key]} onChange={f(key)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              ))}
              <div>
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Statut *</label>
                <select value={form.statut} onChange={f("statut")}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="ouvert">Ouvert</option>
                  <option value="en_cours">En cours</option>
                  <option value="resolu">Résolu</option>
                  <option value="ferme">Fermé</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Solution</label>
                <textarea value={form.solution} onChange={f("solution")} rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
            </div>
            {error && <div className="mx-6 mb-4 bg-destructive/10 text-destructive rounded-xl px-4 py-3 font-body text-sm">{error}</div>}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-border font-body text-sm hover:bg-muted transition">Annuler</button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-body text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition">
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

export default ProblemsPage;
