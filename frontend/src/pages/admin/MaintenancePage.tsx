import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Plus, Pencil, Trash2, Loader2, X, Check } from "lucide-react";

interface Maintenance {
  id: number;
  ambulance_id: number;
  ambulance?: { id: number; immatriculation: string };
  type: string;
  description: string;
  date_debut: string;
  date_fin: string | null;
  statut: string;
  cout: number | null;
  technicien: string | null;
  garage: string | null;
  notes: string | null;
}

interface Ambulance { id: number; immatriculation: string; }

const typeLabels: Record<string, string> = {
  revision: "Révision",
  reparation: "Réparation",
  controle_technique: "Contrôle technique",
  autre: "Autre",
};

const statutColors: Record<string, string> = {
  planifiee: "bg-yellow-100 text-yellow-700",
  en_cours: "bg-blue-100 text-blue-700",
  terminee: "bg-green-100 text-green-700",
};

const emptyForm = {
  ambulance_id: "",
  type: "revision",
  description: "",
  date_debut: "",
  date_fin: "",
  statut: "planifiee",
  cout: "",
  technicien: "",
  garage: "",
  notes: "",
};

const MaintenancePage = () => {
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatut, setFilterStatut] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Maintenance | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = () => {
    setLoading(true);
    const params: any = {};
    if (filterStatut) params.statut = filterStatut;
    Promise.all([
      api.get("/maintenance", { params }),
      api.get("/ambulances"),
    ])
      .then(([m, a]) => { setMaintenances(m.data); setAmbulances(a.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [filterStatut]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEdit = (m: Maintenance) => {
    setEditing(m);
    setForm({
      ambulance_id: String(m.ambulance_id),
      type: m.type,
      description: m.description,
      date_debut: m.date_debut,
      date_fin: m.date_fin || "",
      statut: m.statut,
      cout: m.cout != null ? String(m.cout) : "",
      technicien: m.technicien || "",
      garage: m.garage || "",
      notes: m.notes || "",
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const payload = { ...form, cout: form.cout !== "" ? Number(form.cout) : null };
    try {
      editing
        ? await api.put(`/maintenance/${editing.id}`, payload)
        : await api.post("/maintenance", payload);
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
    if (!confirm("Supprimer cette maintenance ?")) return;
    await api.delete(`/maintenance/${id}`);
    fetchData();
  };

  const f = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Maintenance</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">{maintenances.length} entrée(s)</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-body text-sm font-semibold hover:bg-primary/90 transition">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      <div className="flex gap-3">
        <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="">Tous les statuts</option>
          <option value="planifiee">Planifiée</option>
          <option value="en_cours">En cours</option>
          <option value="terminee">Terminée</option>
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
                  {["Ambulance", "Type", "Description", "Date début", "Coût (MAD)", "Garage", "Statut", "Actions"].map((h) => (
                    <th key={h} className="text-left font-body text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {maintenances.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-12 font-body text-muted-foreground">Aucune maintenance.</td></tr>
                )}
                {maintenances.map((m) => (
                  <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition">
                    <td className="px-4 py-3 font-body text-sm font-semibold">{m.ambulance?.immatriculation}</td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground">{typeLabels[m.type]}</td>
                    <td className="px-4 py-3 font-body text-sm text-foreground max-w-[200px] truncate">{m.description}</td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground">{m.date_debut}</td>
                    <td className="px-4 py-3 font-body text-sm text-foreground">{m.cout != null ? m.cout.toLocaleString("fr-MA") : "—"}</td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground">{m.garage || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${statutColors[m.statut]}`}>{m.statut}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"><Trash2 className="h-4 w-4" /></button>
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
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-display font-bold text-lg">{editing ? "Modifier" : "Ajouter"} maintenance</h2>
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
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Type *</label>
                <select value={form.type} onChange={f("type")}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Description *</label>
                <input value={form.description} onChange={f("description")}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {[
                { label: "Date début *", key: "date_debut", type: "date" },
                { label: "Date fin", key: "date_fin", type: "date" },
                { label: "Coût (MAD)", key: "cout", type: "number" },
                { label: "Technicien", key: "technicien", type: "text" },
                { label: "Garage", key: "garage", type: "text" },
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
                  <option value="planifiee">Planifiée</option>
                  <option value="en_cours">En cours</option>
                  <option value="terminee">Terminée</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Notes</label>
                <textarea value={form.notes} onChange={f("notes") as any} rows={3}
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

export default MaintenancePage;
