import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Plus, Pencil, Trash2, Loader2, X, Check, Search, User, Link as LinkIcon } from "lucide-react";

type DriverStatut = "en_mission" | "repos" | "conge" | "formation" | "maintenance" | "hors_service";

interface Chauffeur {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  statut: DriverStatut;
  ambulance_id: number | null;
  ambulance?: { id: number; immatriculation: string };
}

interface Ambulance { id: number; immatriculation: string; }

const statutColors: Record<DriverStatut, string> = {
  en_mission:   "bg-blue-100 text-blue-700 border-blue-200",
  repos:        "bg-green-100 text-green-700 border-green-200",
  conge:        "bg-purple-100 text-purple-700 border-purple-200",
  formation:    "bg-orange-100 text-orange-700 border-orange-200",
  maintenance:  "bg-yellow-100 text-yellow-700 border-yellow-200",
  hors_service: "bg-red-100 text-red-700 border-red-200",
};

const statutLabels: Record<DriverStatut, string> = {
  en_mission:   "En Mission",
  repos:        "En Repos",
  conge:        "En Congé",
  formation:    "En Formation",
  maintenance:  "Maintenance",
  hors_service: "Hors Service",
};

const emptyForm = {
  nom: "",
  prenom: "",
  telephone: "",
  statut: "repos" as DriverStatut,
  ambulance_id: "" as string,
};

const DriversPage = () => {
  const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Chauffeur | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get("/chauffeurs", { params: { search: search || undefined, statut: filterStatut || undefined } }),
      api.get("/ambulances"),
    ])
      .then(([c, a]) => { setChauffeurs(c.data); setAmbulances(a.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [search, filterStatut]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(""); setShowModal(true); };

  const openEdit = (c: Chauffeur) => {
    setEditing(c);
    setForm({ nom: c.nom, prenom: c.prenom, telephone: c.telephone, statut: c.statut, ambulance_id: c.ambulance_id ? String(c.ambulance_id) : "" });
    setError(""); setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true); setError("");
    const payload = { ...form, ambulance_id: form.ambulance_id ? Number(form.ambulance_id) : null };
    try {
      editing ? await api.put(`/chauffeurs/${editing.id}`, payload) : await api.post("/chauffeurs", payload);
      setShowModal(false); fetchData();
    } catch (e: any) {
      const errs = e?.response?.data?.errors;
      setError(errs ? Object.values(errs).flat().join(" ") : e?.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce chauffeur ?")) return;
    await api.delete(`/chauffeurs/${id}`); fetchData();
  };

  const counts = chauffeurs.reduce((acc, c) => { acc[c.statut] = (acc[c.statut] || 0) + 1; return acc; }, {} as Record<string, number>);

  const f = (key: string) => (e: React.ChangeEvent<any>) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Gestion des Chauffeurs</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">{chauffeurs.length} chauffeur(s)</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-body text-sm font-semibold hover:bg-primary/90 transition">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {(Object.entries(statutLabels) as [DriverStatut, string][]).map(([key, label]) => (
          <div key={key} className="bg-card border border-border rounded-2xl p-3 text-center">
            <p className="font-body text-[10px] text-muted-foreground mb-1 leading-tight">{label}</p>
            <p className={`font-display text-xl font-bold ${statutColors[key].split(" ")[1]}`}>{counts[key] || 0}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par nom ou prénom..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
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
                  {["Chauffeur", "Téléphone", "Ambulance", "Statut", "Actions"].map((h) => (
                    <th key={h} className="text-left font-body text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chauffeurs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        <User className="h-10 w-10 opacity-30" />
                        <span className="font-body text-sm">Aucun chauffeur enregistré.</span>
                      </div>
                    </td>
                  </tr>
                )}
                {chauffeurs.map((c) => (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-body text-sm font-semibold text-foreground">{c.prenom} {c.nom}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground">{c.telephone}</td>
                    <td className="px-4 py-3">
                      {c.ambulance ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg bg-primary/10 text-primary">
                          <LinkIcon className="h-3 w-3" /> {c.ambulance.immatriculation}
                        </span>
                      ) : (
                        <span className="font-body text-xs text-muted-foreground">Non assigné</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-lg border ${statutColors[c.statut]}`}>
                        {statutLabels[c.statut]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-display font-bold text-lg text-foreground">{editing ? "Modifier le chauffeur" : "Ajouter un chauffeur"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-muted transition"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Prénom *</label>
                  <input type="text" value={form.prenom} onChange={f("prenom")} className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Nom *</label>
                  <input type="text" value={form.nom} onChange={f("nom")} className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Numéro de téléphone *</label>
                <input type="tel" value={form.telephone} onChange={f("telephone")} placeholder="ex: +212661234567" className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Statut *</label>
                <select value={form.statut} onChange={f("statut")} className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {Object.entries(statutLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">
                  Lier à une ambulance
                  <span className="ml-1 text-muted-foreground/60 font-normal">(optionnel)</span>
                </label>
                <select value={form.ambulance_id} onChange={f("ambulance_id")} className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">— Non assigné —</option>
                  {ambulances.map((a) => <option key={a.id} value={a.id}>{a.immatriculation}</option>)}
                </select>
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

export default DriversPage;
