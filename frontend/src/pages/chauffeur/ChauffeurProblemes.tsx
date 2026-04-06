import { useEffect, useState } from "react";
import { useLang } from "@/contexts/AppContexts";
import { AlertTriangle, Plus, Loader2, X, Check, CheckCircle } from "lucide-react";

const chauffeurApi = async (path: string, method = "GET", body?: any) => {
  const token = localStorage.getItem("chauffeur_token");
  const base = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  const res = await fetch(`${base}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error("API error");
  return res.json();
};

interface Probleme {
  id: number;
  titre: string;
  description: string;
  priorite: string;
  statut: "ouvert" | "en_cours" | "resolu" | "ferme";
  date_rapport: string;
  date_resolution?: string;
  solution?: string;
  ambulance?: { immatriculation: string };
}

const statutCfg = {
  ouvert:   "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  en_cours: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  resolu:   "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  ferme:    "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700/50 dark:text-gray-400 dark:border-gray-600",
};

const priorityCfg = {
  critique: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  haute:    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  normale:  "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  faible:   "bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400",
};

const ChauffeurProblemes = () => {
  const { t } = useLang();
  const [problemes, setProblemes] = useState<Probleme[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ titre: "", description: "", priorite: "normale" });

  const load = () => {
    chauffeurApi("/chauffeur/problemes")
      .then(setProblemes)
      .catch(() => setProblemes([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (!form.titre || !form.description) { setError("Titre et description requis."); return; }
    setSaving(true); setError("");
    try {
      await chauffeurApi("/chauffeur/problemes", "POST", form);
      setShowModal(false);
      setForm({ titre: "", description: "", priorite: "normale" });
      load();
    } catch (e: any) {
      setError("Erreur lors de l'envoi.");
    } finally { setSaving(false); }
  };

  const statutLabel = (s: string) => {
    const map: Record<string, string> = { ouvert: t("open"), en_cours: t("inProgress"), resolu: t("resolved"), ferme: t("closed") };
    return map[s] || s;
  };
  const priorityLabel = (p: string) => {
    const map: Record<string, string> = { critique: t("critical"), haute: t("high"), normale: t("normal"), faible: t("low") };
    return map[p] || p;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">{t("myProblems")}</h1>
          <p className="font-body text-sm text-gray-500 dark:text-gray-400 mt-1">{problemes.length} {t("myProblem")}</p>
        </div>
        <button onClick={() => { setShowModal(true); setError(""); }}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl font-body text-sm font-semibold hover:bg-red-700 transition shadow-lg shadow-red-600/20">
          <Plus className="h-4 w-4" /> {t("report")}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-red-500" /></div>
      ) : problemes.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-12 text-center">
          <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="h-8 w-8" />
          </div>
          <p className="font-body text-gray-500 dark:text-gray-400 mt-3">{t("noProblems")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {problemes.map((p) => (
            <div key={p.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${statutCfg[p.statut]}`}>
                  {statutLabel(p.statut)}
                </span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${priorityCfg[p.priorite]}`}>
                  {priorityLabel(p.priorite)}
                </span>
                {p.ambulance && (
                  <span className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                    🚑 {p.ambulance.immatriculation}
                  </span>
                )}
              </div>
              <h3 className="font-display font-semibold text-gray-900 dark:text-white">{p.titre}</h3>
              <p className="font-body text-sm text-gray-500 dark:text-gray-400 mt-1">{p.description}</p>
              <div className="flex flex-wrap gap-4 mt-3 font-body text-xs text-gray-400 dark:text-gray-500">
                <span>📅 {p.date_rapport}</span>
                {p.date_resolution && <span>✅ {p.date_resolution}</span>}
              </div>
              {p.solution && (
                <div className="mt-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-xl p-3">
                  <p className="font-body text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">{t("solution")}</p>
                  <p className="font-body text-sm text-emerald-800 dark:text-emerald-300">{p.solution}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">{t("reportProblem")}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block font-body text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{t("problemTitle")} *</label>
                <input value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })}
                  placeholder={t("problemTitle")}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 transition" />
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{t("priority")} *</label>
                <select value={form.priorite} onChange={e => setForm({ ...form, priorite: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 transition">
                  <option value="faible">{t("low")}</option>
                  <option value="normale">{t("normal")}</option>
                  <option value="haute">{t("high")}</option>
                  <option value="critique">{t("critical")}</option>
                </select>
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{t("problemDesc")} *</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={4} placeholder={t("problemDesc")}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 transition resize-none" />
              </div>
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 font-body text-sm">{error}</div>
              )}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 font-body text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                {t("cancel")}
              </button>
              <button onClick={handleSubmit} disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white font-body text-sm font-semibold hover:bg-red-700 disabled:opacity-60 transition">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {t("submitReport")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChauffeurProblemes;
