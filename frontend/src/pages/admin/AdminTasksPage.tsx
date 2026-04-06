import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useLang } from "@/contexts/AppContexts";
import { CheckSquare, Plus, Pencil, Trash2, Loader2, X, Check, CheckCircle } from "lucide-react";

interface Chauffeur { id: number; nom: string; prenom: string; }
interface Ambulance { id: number; immatriculation: string; }
interface Tache {
  id: number;
  titre: string;
  description: string;
  statut: string;
  confirme_par_admin: boolean;
  date_debut: string;
  date_fin?: string;
  notes_admin?: string;
  chauffeur?: { id: number; nom: string; prenom: string };
  ambulance?: { immatriculation: string };
}

const statutCls: Record<string, string> = {
  en_attente: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  en_cours:   "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  terminee:   "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
};

const emptyForm = { chauffeur_id: "", ambulance_id: "", titre: "", description: "", statut: "en_attente", confirme_par_admin: false, date_debut: new Date().toISOString().split("T")[0], date_fin: "", notes_admin: "" };

const AdminTasksPage = () => {
  const { t } = useLang();
  const [taches, setTaches] = useState<Tache[]>([]);
  const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Tache | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [filterChauffeur, setFilterChauffeur] = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get("/taches", { params: filterChauffeur ? { chauffeur_id: filterChauffeur } : {} }),
      api.get("/chauffeurs"),
      api.get("/ambulances"),
    ])
      .then(([t, c, a]) => { setTaches(t.data); setChauffeurs(c.data); setAmbulances(a.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filterChauffeur]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(""); setShowModal(true); };
  const openEdit = (tache: Tache) => {
    setEditing(tache);
    setForm({ chauffeur_id: String(tache.chauffeur?.id || ""), ambulance_id: "", titre: tache.titre, description: tache.description, statut: tache.statut, confirme_par_admin: tache.confirme_par_admin, date_debut: tache.date_debut, date_fin: tache.date_fin || "", notes_admin: tache.notes_admin || "" });
    setError(""); setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      const payload = { ...form, ambulance_id: form.ambulance_id || null };
      editing ? await api.put(`/taches/${editing.id}`, payload) : await api.post("/taches", payload);
      setShowModal(false); load();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Erreur.");
    } finally { setSaving(false); }
  };

  const toggleConfirm = async (tache: Tache) => {
    await api.patch(`/taches/${tache.id}/confirmer`, { confirme: !tache.confirme_par_admin });
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("confirmDelete"))) return;
    await api.delete(`/taches/${id}`); load();
  };

  const f = (key: string) => (e: React.ChangeEvent<any>) => setForm({ ...form, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground dark:text-white flex items-center gap-3">
            <CheckSquare className="h-6 w-6 text-primary" /> Gestion des Tâches
          </h1>
          <p className="font-body text-sm text-muted-foreground mt-1">{taches.length} {t("task")}</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-body text-sm font-semibold hover:bg-primary/90 transition">
          <Plus className="h-4 w-4" /> {t("add")}
        </button>
      </div>

      {/* Filter by driver */}
      <div className="flex gap-3">
        <select value={filterChauffeur} onChange={e => setFilterChauffeur(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-border dark:border-gray-600 bg-card dark:bg-gray-800 text-foreground dark:text-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
          <option value="">Tous les chauffeurs</option>
          {chauffeurs.map(c => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-3">
          {taches.length === 0 && (
            <div className="bg-card dark:bg-gray-800 border border-border dark:border-gray-700 rounded-2xl p-12 text-center">
              <CheckSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="font-body text-muted-foreground">{t("noTasks")}</p>
            </div>
          )}
          {taches.map(tache => (
            <div key={tache.id} className="bg-card dark:bg-gray-800 border border-border dark:border-gray-700 rounded-2xl p-5 flex items-start justify-between gap-4 hover:border-primary/30 transition shadow-sm">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${statutCls[tache.statut]}`}>{tache.statut}</span>
                  {tache.confirme_par_admin ? (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> {t("confirmedByAdmin")}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground px-2 py-1 rounded-lg border border-dashed border-border dark:border-gray-600">{t("notConfirmed")}</span>
                  )}
                  {tache.chauffeur && (
                    <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-lg">
                      👤 {tache.chauffeur.prenom} {tache.chauffeur.nom}
                    </span>
                  )}
                </div>
                <h3 className="font-display font-semibold text-foreground dark:text-white">{tache.titre}</h3>
                <p className="font-body text-sm text-muted-foreground mt-1 line-clamp-2">{tache.description}</p>
                <div className="flex flex-wrap gap-3 mt-2 font-body text-xs text-muted-foreground">
                  <span>📅 {tache.date_debut}</span>
                  {tache.date_fin && <span>→ {tache.date_fin}</span>}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => toggleConfirm(tache)} title={tache.confirme_par_admin ? "Annuler confirmation" : "Confirmer"}
                  className={`p-2 rounded-xl transition ${tache.confirme_par_admin ? "hover:bg-amber-50 dark:hover:bg-amber-900/20 text-green-600 hover:text-amber-600" : "hover:bg-green-50 dark:hover:bg-green-900/20 text-muted-foreground hover:text-green-600"}`}>
                  <CheckCircle className="h-4 w-4" />
                </button>
                <button onClick={() => openEdit(tache)} className="p-2 rounded-xl hover:bg-muted dark:hover:bg-gray-700 text-muted-foreground hover:text-foreground transition"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(tache.id)} className="p-2 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-card dark:bg-gray-900 border border-border dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border dark:border-gray-700">
              <h2 className="font-display font-bold text-lg text-foreground dark:text-white">{editing ? "Modifier la tâche" : "Créer une tâche"}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-muted dark:hover:bg-gray-700 text-muted-foreground transition"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-4">
              {[
                { label: "Chauffeur *", key: "chauffeur_id", type: "select", opts: chauffeurs.map(c => ({ v: c.id, l: `${c.prenom} ${c.nom}` })) },
                { label: "Ambulance", key: "ambulance_id", type: "select", opts: ambulances.map(a => ({ v: a.id, l: a.immatriculation })) },
              ].map(({ label, key, opts }) => (
                <div key={key}>
                  <label className="block font-body text-xs font-medium text-muted-foreground mb-1">{label}</label>
                  <select value={(form as any)[key]} onChange={f(key)}
                    className="w-full px-3 py-2 rounded-xl border border-border dark:border-gray-600 bg-background dark:bg-gray-800 text-foreground dark:text-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="">— {t("choose")} —</option>
                    {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                  </select>
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">{t("taskTitle")} *</label>
                <input value={form.titre} onChange={f("titre")} className="w-full px-3 py-2 rounded-xl border border-border dark:border-gray-600 bg-background dark:bg-gray-800 text-foreground dark:text-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">{t("taskDesc")}</label>
                <textarea value={form.description} onChange={f("description")} rows={3} className="w-full px-3 py-2 rounded-xl border border-border dark:border-gray-600 bg-background dark:bg-gray-800 text-foreground dark:text-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">{t("startDate")} *</label>
                <input type="date" value={form.date_debut} onChange={f("date_debut")} className="w-full px-3 py-2 rounded-xl border border-border dark:border-gray-600 bg-background dark:bg-gray-800 text-foreground dark:text-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">{t("endDate")}</label>
                <input type="date" value={form.date_fin} onChange={f("date_fin")} className="w-full px-3 py-2 rounded-xl border border-border dark:border-gray-600 bg-background dark:bg-gray-800 text-foreground dark:text-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">{t("status")}</label>
                <select value={form.statut} onChange={f("statut")} className="w-full px-3 py-2 rounded-xl border border-border dark:border-gray-600 bg-background dark:bg-gray-800 text-foreground dark:text-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                  <option value="en_attente">{t("pendingTasks")}</option>
                  <option value="en_cours">{t("inProgressTasks")}</option>
                  <option value="terminee">{t("completedTasks")}</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-5">
                <input type="checkbox" id="confirme" checked={form.confirme_par_admin} onChange={f("confirme_par_admin")} className="h-4 w-4 rounded accent-primary cursor-pointer" />
                <label htmlFor="confirme" className="font-body text-sm text-foreground dark:text-white cursor-pointer">{t("confirmedByAdmin")}</label>
              </div>
              <div className="sm:col-span-2">
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">{t("adminNotes")}</label>
                <textarea value={form.notes_admin} onChange={f("notes_admin")} rows={2} className="w-full px-3 py-2 rounded-xl border border-border dark:border-gray-600 bg-background dark:bg-gray-800 text-foreground dark:text-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
            </div>
            {error && <div className="mx-6 mb-4 bg-destructive/10 text-destructive rounded-xl px-4 py-3 font-body text-sm">{error}</div>}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border dark:border-gray-700">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-border dark:border-gray-600 font-body text-sm text-foreground dark:text-gray-300 hover:bg-muted dark:hover:bg-gray-700 transition">{t("cancel")}</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-body text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {editing ? t("save") : t("create")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTasksPage;
