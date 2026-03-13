import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Plus, Pencil, Trash2, Loader2, X, Check, Search,
} from "lucide-react";

type Statut = "disponible" | "en_service" | "maintenance" | "hors_service";

interface Ambulance {
  id: number;
  immatriculation: string;
  marque: string;
  modele: string;
  annee: number;
  statut: Statut;
  conducteur: string | null;
  telephone_conducteur: string | null;
  kilometrage: number;
  derniere_revision: string | null;
  prochaine_revision: string | null;
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
  en_service:   "En service",
  maintenance:  "Maintenance",
  hors_service: "Hors service",
};

const emptyForm = {
  immatriculation: "",
  marque: "",
  modele: "",
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

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEdit = (a: Ambulance) => {
    setEditing(a);
    setForm({
      immatriculation: a.immatriculation,
      marque: a.marque,
      modele: a.modele,
      annee: a.annee,
      statut: a.statut,
      conducteur: a.conducteur || "",
      telephone_conducteur: a.telephone_conducteur || "",
      kilometrage: a.kilometrage,
      derniere_revision: a.derniere_revision || "",
      prochaine_revision: a.prochaine_revision || "",
      notes: a.notes || "",
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await api.put(`/ambulances/${editing.id}`, form);
      } else {
        await api.post("/ambulances", form);
      }
      setShowModal(false);
      fetchData();
    } catch (e: any) {
      const errs = e?.response?.data?.errors;
      if (errs) {
        setError(Object.values(errs).flat().join(" "));
      } else {
        setError(e?.response?.data?.message || "Erreur lors de l'enregistrement.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette ambulance ?")) return;
    await api.delete(`/ambulances/${id}`);
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Gestion de la Flotte</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">{ambulances.length} véhicule(s)</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-body text-sm font-semibold hover:bg-primary/90 transition">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher immatriculation, conducteur..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>
        <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="">Tous les statuts</option>
          {Object.entries(statutLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {["Immatriculation", "Marque / Modèle", "Année", "Conducteur", "Km", "Statut", "Actions"].map((h) => (
                    <th key={h} className="text-left font-body text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ambulances.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-12 font-body text-muted-foreground">Aucun véhicule trouvé.</td></tr>
                )}
                {ambulances.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition">
                    <td className="px-4 py-3 font-body text-sm font-semibold text-foreground">{a.immatriculation}</td>
                    <td className="px-4 py-3 font-body text-sm text-foreground">{a.marque} {a.modele}</td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground">{a.annee}</td>
                    <td className="px-4 py-3 font-body text-sm text-foreground">{a.conducteur || "—"}</td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground">{a.kilometrage.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-lg border ${statutColors[a.statut]}`}>
                        {statutLabels[a.statut]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition">
                          <Trash2 className="h-4 w-4" />
                        </button>
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
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-display font-bold text-lg text-foreground">
                {editing ? "Modifier l'ambulance" : "Ajouter une ambulance"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-muted transition">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 grid sm:grid-cols-2 gap-4">
              {[
                { label: "Immatriculation *", key: "immatriculation", type: "text" },
                { label: "Marque *", key: "marque", type: "text" },
                { label: "Modèle *", key: "modele", type: "text" },
                { label: "Année *", key: "annee", type: "number" },
                { label: "Conducteur", key: "conducteur", type: "text" },
                { label: "Tél. conducteur", key: "telephone_conducteur", type: "text" },
                { label: "Kilométrage", key: "kilometrage", type: "number" },
                { label: "Dernière révision", key: "derniere_revision", type: "date" },
                { label: "Prochaine révision", key: "prochaine_revision", type: "date" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block font-body text-xs font-medium text-muted-foreground mb-1">{label}</label>
                  <input type={type} value={(form as any)[key]}
                    onChange={(e) => setForm({ ...form, [key]: type === "number" ? Number(e.target.value) : e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              ))}

              <div>
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Statut *</label>
                <select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value as Statut })}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {Object.entries(statutLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
            </div>

            {error && <div className="mx-6 mb-4 bg-destructive/10 text-destructive rounded-xl px-4 py-3 font-body text-sm">{error}</div>}

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-border font-body text-sm hover:bg-muted transition">
                Annuler
              </button>
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

export default FleetManagement;
