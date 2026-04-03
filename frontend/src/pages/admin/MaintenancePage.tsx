import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Plus, Pencil, Trash2, Loader2, X, Check, Wrench, AlertTriangle, User } from "lucide-react";

/* ─── Types ─────────────────────────────────────────────── */
interface Ambulance { id: number; immatriculation: string; }

interface Maintenance {
  id: number; ambulance_id: number;
  ambulance?: { id: number; immatriculation: string };
  type: string; description: string; date_debut: string;
  date_fin: string | null; statut: string;
  cout: number | null; technicien: string | null; garage: string | null; notes: string | null;
}

interface Probleme {
  id: number; ambulance_id: number;
  ambulance?: { id: number; immatriculation: string };
  titre: string; description: string; priorite: string; statut: string;
  rapporte_par: string | null; date_rapport: string;
  date_resolution: string | null; solution: string | null;
}

interface Chauffeur {
  id: number; nom: string; prenom: string; telephone: string; statut: string;
  ambulance?: { id: number; immatriculation: string };
}

/* ─── Configs ────────────────────────────────────────────── */
const typeLabels: Record<string, string> = { revision: "Révision", reparation: "Réparation", controle_technique: "Contrôle technique", autre: "Autre" };
const maintStatutColors: Record<string, string> = { planifiee: "bg-yellow-100 text-yellow-700", en_cours: "bg-blue-100 text-blue-700", terminee: "bg-green-100 text-green-700" };
const priorityColors: Record<string, string> = { critique: "bg-red-100 text-red-700 border-red-200", haute: "bg-orange-100 text-orange-700 border-orange-200", normale: "bg-blue-50 text-blue-700 border-blue-200", faible: "bg-muted text-muted-foreground border-border" };
const problemStatutColors: Record<string, string> = { ouvert: "bg-red-100 text-red-700", en_cours: "bg-blue-100 text-blue-700", resolu: "bg-green-100 text-green-700", ferme: "bg-muted text-muted-foreground" };

const emptyMaintForm = { ambulance_id: "", type: "revision", description: "", date_debut: "", date_fin: "", statut: "planifiee", cout: "", technicien: "", garage: "", notes: "" };
const emptyProbForm = { ambulance_id: "", titre: "", description: "", priorite: "normale", statut: "ouvert", rapporte_par: "", date_rapport: new Date().toISOString().split("T")[0], date_resolution: "", solution: "" };

/* ─── Component ──────────────────────────────────────────── */
const MaintenancePage = () => {
  const [tab, setTab] = useState<"maintenance" | "problemes">("maintenance");

  // Maintenance state
  const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
  const [maintLoading, setMaintLoading] = useState(true);
  const [maintFilterStatut, setMaintFilterStatut] = useState("");
  const [showMaintModal, setShowMaintModal] = useState(false);
  const [editingMaint, setEditingMaint] = useState<Maintenance | null>(null);
  const [maintForm, setMaintForm] = useState(emptyMaintForm);
  const [maintSaving, setMaintSaving] = useState(false);
  const [maintError, setMaintError] = useState("");

  // Problèmes state
  const [problemes, setProblemes] = useState<Probleme[]>([]);
  const [probLoading, setProbLoading] = useState(true);
  const [probFilterStatut, setProbFilterStatut] = useState("");
  const [probFilterPriorite, setProbFilterPriorite] = useState("");
  const [showProbModal, setShowProbModal] = useState(false);
  const [editingProb, setEditingProb] = useState<Probleme | null>(null);
  const [probForm, setProbForm] = useState(emptyProbForm);
  const [probSaving, setProbSaving] = useState(false);
  const [probError, setProbError] = useState("");

  // Shared
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [chauffeursMaintenance, setChauffeursMaintenance] = useState<Chauffeur[]>([]);

  /* ── Fetches ── */
  const fetchMaintenances = () => {
    setMaintLoading(true);
    const params: any = {};
    if (maintFilterStatut) params.statut = maintFilterStatut;
    api.get("/maintenance", { params })
      .then((r) => setMaintenances(r.data))
      .catch(console.error)
      .finally(() => setMaintLoading(false));
  };

  const fetchProblemes = () => {
    setProbLoading(true);
    const params: any = {};
    if (probFilterStatut) params.statut = probFilterStatut;
    if (probFilterPriorite) params.priorite = probFilterPriorite;
    api.get("/problems", { params })
      .then((r) => setProblemes(r.data))
      .catch(console.error)
      .finally(() => setProbLoading(false));
  };

  const fetchShared = () => {
    api.get("/ambulances").then((r) => setAmbulances(r.data)).catch(console.error);
    api.get("/chauffeurs", { params: { statut: "maintenance" } })
      .then((r) => setChauffeursMaintenance(r.data))
      .catch(() => setChauffeursMaintenance([]));
  };

  useEffect(() => { fetchMaintenances(); fetchShared(); }, [maintFilterStatut]);
  useEffect(() => { fetchProblemes(); }, [probFilterStatut, probFilterPriorite]);

  /* ── Maintenance CRUD ── */
  const openCreateMaint = () => { setEditingMaint(null); setMaintForm(emptyMaintForm); setMaintError(""); setShowMaintModal(true); };
  const openEditMaint = (m: Maintenance) => {
    setEditingMaint(m);
    setMaintForm({ ambulance_id: String(m.ambulance_id), type: m.type, description: m.description, date_debut: m.date_debut, date_fin: m.date_fin || "", statut: m.statut, cout: m.cout != null ? String(m.cout) : "", technicien: m.technicien || "", garage: m.garage || "", notes: m.notes || "" });
    setMaintError(""); setShowMaintModal(true);
  };
  const handleSaveMaint = async () => {
    setMaintSaving(true); setMaintError("");
    const payload = { ...maintForm, cout: maintForm.cout !== "" ? Number(maintForm.cout) : null };
    try {
      editingMaint ? await api.put(`/maintenance/${editingMaint.id}`, payload) : await api.post("/maintenance", payload);
      setShowMaintModal(false); fetchMaintenances();
    } catch (e: any) {
      const errs = e?.response?.data?.errors;
      setMaintError(errs ? Object.values(errs).flat().join(" ") : e?.response?.data?.message || "Erreur.");
    } finally { setMaintSaving(false); }
  };
  const handleDeleteMaint = async (id: number) => {
    if (!confirm("Supprimer cette maintenance ?")) return;
    await api.delete(`/maintenance/${id}`); fetchMaintenances();
  };
  const fm = (key: string) => (e: React.ChangeEvent<any>) => setMaintForm({ ...maintForm, [key]: e.target.value });

  /* ── Problèmes CRUD ── */
  const openCreateProb = () => { setEditingProb(null); setProbForm(emptyProbForm); setProbError(""); setShowProbModal(true); };
  const openEditProb = (p: Probleme) => {
    setEditingProb(p);
    setProbForm({ ambulance_id: String(p.ambulance_id), titre: p.titre, description: p.description, priorite: p.priorite, statut: p.statut, rapporte_par: p.rapporte_par || "", date_rapport: p.date_rapport, date_resolution: p.date_resolution || "", solution: p.solution || "" });
    setProbError(""); setShowProbModal(true);
  };
  const handleSaveProb = async () => {
    setProbSaving(true); setProbError("");
    try {
      editingProb ? await api.put(`/problems/${editingProb.id}`, probForm) : await api.post("/problems", probForm);
      setShowProbModal(false); fetchProblemes();
    } catch (e: any) {
      const errs = e?.response?.data?.errors;
      setProbError(errs ? Object.values(errs).flat().join(" ") : e?.response?.data?.message || "Erreur.");
    } finally { setProbSaving(false); }
  };
  const handleDeleteProb = async (id: number) => {
    if (!confirm("Supprimer ce problème ?")) return;
    await api.delete(`/problems/${id}`); fetchProblemes();
  };
  const fp = (key: string) => (e: React.ChangeEvent<any>) => setProbForm({ ...probForm, [key]: e.target.value });

  /* ─── RENDER ─────────────────────────────────────────────── */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Maintenance & Problèmes</h1>
          <p className="font-body text-sm text-muted-foreground mt-1">Suivi des maintenances et signalement des problèmes</p>
        </div>
        <button
          onClick={tab === "maintenance" ? openCreateMaint : openCreateProb}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-body text-sm font-semibold hover:bg-primary/90 transition"
        >
          <Plus className="h-4 w-4" /> {tab === "maintenance" ? "Ajouter" : "Signaler"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab("maintenance")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm font-medium transition ${tab === "maintenance" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Wrench className="h-4 w-4" /> Maintenances
          <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">{maintenances.length}</span>
        </button>
        <button
          onClick={() => setTab("problemes")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm font-medium transition ${tab === "problemes" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
        >
          <AlertTriangle className="h-4 w-4" /> Problèmes
          <span className="ml-1 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">{problemes.length}</span>
        </button>
      </div>

      {/* ── CHAUFFEURS EN MAINTENANCE (bannière commune) ── */}
      {chauffeursMaintenance.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-yellow-600" />
            <span className="font-body text-sm font-semibold text-yellow-700">Chauffeurs en Maintenance ({chauffeursMaintenance.length})</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {chauffeursMaintenance.map((c) => (
              <div key={c.id} className="flex items-center gap-2 bg-white border border-yellow-200 rounded-xl px-3 py-2">
                <div className="h-7 w-7 rounded-full bg-yellow-100 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-body text-xs font-semibold text-foreground">{c.prenom} {c.nom}</p>
                  {c.ambulance && <p className="font-body text-[10px] text-muted-foreground">{c.ambulance.immatriculation}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════════════ TAB: MAINTENANCE ════════════ */}
      {tab === "maintenance" && (
        <>
          <div className="flex gap-3">
            <select value={maintFilterStatut} onChange={(e) => setMaintFilterStatut(e.target.value)} className="px-3 py-2.5 rounded-xl border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">Tous les statuts</option>
              <option value="planifiee">Planifiée</option>
              <option value="en_cours">En cours</option>
              <option value="terminee">Terminée</option>
            </select>
          </div>

          {maintLoading ? (
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
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${maintStatutColors[m.statut]}`}>{m.statut}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => openEditMaint(m)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition"><Pencil className="h-4 w-4" /></button>
                            <button onClick={() => handleDeleteMaint(m.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ════════════ TAB: PROBLÈMES ════════════ */}
      {tab === "problemes" && (
        <>
          <div className="flex flex-wrap gap-3">
            <select value={probFilterStatut} onChange={(e) => setProbFilterStatut(e.target.value)} className="px-3 py-2.5 rounded-xl border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">Tous les statuts</option>
              <option value="ouvert">Ouvert</option>
              <option value="en_cours">En cours</option>
              <option value="resolu">Résolu</option>
              <option value="ferme">Fermé</option>
            </select>
            <select value={probFilterPriorite} onChange={(e) => setProbFilterPriorite(e.target.value)} className="px-3 py-2.5 rounded-xl border border-border bg-card font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">Toutes priorités</option>
              <option value="critique">Critique</option>
              <option value="haute">Haute</option>
              <option value="normale">Normale</option>
              <option value="faible">Faible</option>
            </select>
          </div>

          {probLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-3">
              {problemes.length === 0 && (
                <div className="bg-card border border-border rounded-2xl p-12 text-center font-body text-muted-foreground">Aucun problème trouvé.</div>
              )}
              {problemes.map((p) => (
                <div key={p.id} className="bg-card border border-border rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-primary/20 transition">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-lg border ${priorityColors[p.priorite]}`}>{p.priorite}</span>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-lg ${problemStatutColors[p.statut]}`}>{p.statut}</span>
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
                    <button onClick={() => openEditProb(p)} className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDeleteProb(p.id)} className="p-2 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ════ MODAL MAINTENANCE ════ */}
      {showMaintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-display font-bold text-lg">{editingMaint ? "Modifier" : "Ajouter"} maintenance</h2>
              <button onClick={() => setShowMaintModal(false)} className="p-2 rounded-xl hover:bg-muted transition"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Ambulance *</label>
                <select value={maintForm.ambulance_id} onChange={fm("ambulance_id")} className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">-- Choisir --</option>
                  {ambulances.map((a) => <option key={a.id} value={a.id}>{a.immatriculation}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Type *</label>
                <select value={maintForm.type} onChange={fm("type")} className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Description *</label>
                <input value={maintForm.description} onChange={fm("description")} className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              {[{ label: "Date début *", key: "date_debut", type: "date" }, { label: "Date fin", key: "date_fin", type: "date" }, { label: "Coût (MAD)", key: "cout", type: "number" }, { label: "Technicien", key: "technicien", type: "text" }, { label: "Garage", key: "garage", type: "text" }].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block font-body text-xs font-medium text-muted-foreground mb-1">{label}</label>
                  <input type={type} value={(maintForm as any)[key]} onChange={fm(key)} className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              ))}
              <div>
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Statut *</label>
                <select value={maintForm.statut} onChange={fm("statut")} className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="planifiee">Planifiée</option>
                  <option value="en_cours">En cours</option>
                  <option value="terminee">Terminée</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Notes</label>
                <textarea value={maintForm.notes} onChange={fm("notes")} rows={3} className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
            </div>
            {maintError && <div className="mx-6 mb-4 bg-destructive/10 text-destructive rounded-xl px-4 py-3 font-body text-sm">{maintError}</div>}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowMaintModal(false)} className="px-4 py-2 rounded-xl border border-border font-body text-sm hover:bg-muted transition">Annuler</button>
              <button onClick={handleSaveMaint} disabled={maintSaving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-body text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition">
                {maintSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {editingMaint ? "Enregistrer" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════ MODAL PROBLÈME ════ */}
      {showProbModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-display font-bold text-lg">{editingProb ? "Modifier" : "Signaler"} un problème</h2>
              <button onClick={() => setShowProbModal(false)} className="p-2 rounded-xl hover:bg-muted transition"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Ambulance *</label>
                <select value={probForm.ambulance_id} onChange={fp("ambulance_id")} className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="">-- Choisir --</option>
                  {ambulances.map((a) => <option key={a.id} value={a.id}>{a.immatriculation}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Priorité *</label>
                <select value={probForm.priorite} onChange={fp("priorite")} className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="faible">Faible</option>
                  <option value="normale">Normale</option>
                  <option value="haute">Haute</option>
                  <option value="critique">Critique</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Titre *</label>
                <input value={probForm.titre} onChange={fp("titre")} className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Description *</label>
                <textarea value={probForm.description} onChange={fp("description")} rows={3} className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              {[{ label: "Rapporté par", key: "rapporte_par", type: "text" }, { label: "Date rapport *", key: "date_rapport", type: "date" }, { label: "Date résolution", key: "date_resolution", type: "date" }].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block font-body text-xs font-medium text-muted-foreground mb-1">{label}</label>
                  <input type={type} value={(probForm as any)[key]} onChange={fp(key)} className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
              ))}
              <div>
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Statut *</label>
                <select value={probForm.statut} onChange={fp("statut")} className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="ouvert">Ouvert</option>
                  <option value="en_cours">En cours</option>
                  <option value="resolu">Résolu</option>
                  <option value="ferme">Fermé</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">Solution</label>
                <textarea value={probForm.solution} onChange={fp("solution")} rows={2} className="w-full px-3 py-2 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
            </div>
            {probError && <div className="mx-6 mb-4 bg-destructive/10 text-destructive rounded-xl px-4 py-3 font-body text-sm">{probError}</div>}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setShowProbModal(false)} className="px-4 py-2 rounded-xl border border-border font-body text-sm hover:bg-muted transition">Annuler</button>
              <button onClick={handleSaveProb} disabled={probSaving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-body text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition">
                {probSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {editingProb ? "Enregistrer" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenancePage;
