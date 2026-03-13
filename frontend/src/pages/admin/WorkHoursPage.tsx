import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Plus, Pencil, Trash2, Loader2, X, Check, Clock } from "lucide-react";

interface HeureTravail {
  id: number;
  ambulance_id: number;
  ambulance?: { id: number; immatriculation: string };
  conducteur: string;
  date: string;
  heure_debut: string;
  heure_fin: string | null;
  heures_total: number | null;
  type_service: string;
  nombre_interventions: number;
  notes: string | null;
}

interface Ambulance { id: number; immatriculation: string; }

const typeServiceLabels: Record<string, string> = {
  urgence:    "Urgence",
  transfert:  "Transfert",
  permanence: "Permanence",
  autre:      "Autre",
};

const typeServiceColors: Record<string, string> = {
  urgence:    "bg-red-100 text-red-700",
  transfert:  "bg-blue-100 text-blue-700",
  permanence: "bg-green-100 text-green-700",
  autre:      "bg-muted text-muted-foreground",
};

const emptyForm = {
  ambulance_id: "",
  conducteur: "",
  date: new Date().toISOString().split("T")[0],
  heure_debut: "08:00",
  heure_fin: "",
  heures_total: "",
  type_service: "permanence",
  nombre_interventions: "0",
  notes: "",
};

const WorkHoursPage = () => {
  const [heures, setHeures] = useState<HeureTravail[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<HeureTravail | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Summary stats
  const totalHeures = heures.reduce((s, h) => s + (h.heures_total || 0), 0);
  const totalInterventions = heures.reduce((s, h) => s + h.nombre_interventions, 0);

  const fetchData = () => {
    setLoading(true);
    Promise.all([api.get("/work-hours"), api.get("/ambulances")])
      .then(([h, a]) => { setHeures(h.data); setAmbulances(a.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(""); setShowModal(true); };

  const openEdit = (h: HeureTravail) => {
    setEditing(h);
    setForm({
      ambulance_id: String(h.ambulance_id),
      conducteur: h.conducteur,
      date: h.date,
      heure_debut: h.heure_debut,
      heure_fin: h.heure_fin || "",
      heures_total: h.heures_total != null ? String(h.heures_total) : "",
      type_service: h.type_service,
      nombre_interventions: String(h.nombre_interventions),
      notes: h.notes || "",
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      heures_total: form.heures_total !== "" ? Number(form.heures_total) : null,
      nombre_interventions: Number(form.nombre_interventions),
    };
    try {
      editing
        ? await api.put(`/work-hours/${editing.id}`, payload)
        : await api.post("/work-hours", payload);
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
    if (!confirm("Supprimer cette entrée ?")) return;
    await api.delete(`/work-hours/${id}`);
    fetchData();
  };

  const f = (key: string) => (e: React.ChangeEvent<any>) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Heures de Travail</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">{heures.length} entrée(s)</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-body text-sm font-semibold hover:bg-primary/90 transition">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Total heures", value: `${totalHeures.toFixed(1)}h`, icon: Clock, color: "bg-primary/10 text-primary" },
          { label: "Interventions", value: totalInterventions, icon: Clock, color: "bg-orange-100 text-orange-600" },
          { label: "Entrées", value: heures.length, icon: Clock, color: "bg-green-100 text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-body text-xs text-muted-foreground">{s.label}</p>
              <p className="font-display text-xl font-bold text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  {["Date", "Ambulance", "Conducteur", "Heures", "Service", "Interventions", "Notes", "Actions"].map((h) => (
                    <th key={h} className="text-left font-body text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heures.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-12 font-body text-muted-foreground">Aucune entrée.</td></tr>
                )}
                {heures.map((h) => (
                  <tr key={h.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition">
                    <td className="px-4 py-3 font-body text-sm font-medium text-foreground">{h.date}</td>
                    <td className="px-4 py-3 font-body text-sm font-semibold">{h.ambulance?.immatriculation}</td>
                    <td className="px-4 py-3 font-body text-sm text-foreground">{h.conducteur}</td>
                    <td className="px-4 py-3 font-body text-sm text-foreground">
                      <span className="font-semibold">{h.heures_total ?? "?"}</span>h
                      <span className="text-muted-foreground ml-1 text-xs">({h.heure_debut}→{h.heure_fin || "?"})</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${typeServiceColors[h.type_service]}`}>
                        {typeServiceLabels[h.type_service]}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-center text-foreground">{h.nombre_interventions}</td>
                    <td className="px-4 py-3 font-body text-xs text-muted-foreground max-w-[150px] truncate">{h.notes || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(h)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => handleDelete(h.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"><Trash2 className="h-4 w-4" /></button>
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
              <h2 className="font-display font-bold text-lg">{editing ? "Modifier" : "Ajouter"} heures de travail</h2>
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
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Conducteur *</label>
                <input value={form.conducteur} onChange={f("conducteur")}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {[
                { label: "Date *", key: "date", type: "date" },
                { label: "Heure début *", key: "heure_debut", type: "time" },
                { label: "Heure fin", key: "heure_fin", type: "time" },
                { label: "Heures total", key: "heures_total", type: "number" },
                { label: "Nb interventions", key: "nombre_interventions", type: "number" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block font-body text-xs font-medium text-muted-foreground mb-1">{label}</label>
                  <input type={type} value={(form as any)[key]} onChange={f(key)} step={type === "number" ? "0.1" : undefined}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              ))}
              <div>
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Type service *</label>
                <select value={form.type_service} onChange={f("type_service")}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {Object.entries(typeServiceLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Notes</label>
                <textarea value={form.notes} onChange={f("notes")} rows={2}
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

export default WorkHoursPage;
