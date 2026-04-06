import { useEffect, useState } from "react";
import { useLang } from "@/contexts/AppContexts";
import { ClipboardList, Loader2, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

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

interface Tache {
  id: number;
  titre: string;
  description: string;
  statut: "en_attente" | "en_cours" | "terminee";
  confirme_par_admin: boolean;
  date_debut: string;
  date_fin?: string;
  notes_admin?: string;
  ambulance?: { immatriculation: string };
}

const statutConfig = {
  en_attente: { label: (t: any) => t("pendingTasks"),    icon: Clock,        cls: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800" },
  en_cours:   { label: (t: any) => t("inProgressTasks"), icon: AlertCircle,  cls: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800" },
  terminee:   { label: (t: any) => t("completedTasks"),  icon: CheckCircle,  cls: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800" },
};

const ChauffeurTaches = () => {
  const { t } = useLang();
  const [taches, setTaches] = useState<Tache[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    chauffeurApi("/chauffeur/taches" + (filter ? `?statut=${filter}` : ""))
      .then(setTaches)
      .catch(() => setTaches([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const updateStatut = async (id: number, statut: string) => {
    try {
      await chauffeurApi(`/chauffeur/taches/${id}/statut`, "PATCH", { statut });
      load();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">{t("myTasks")}</h1>
        <p className="font-body text-sm text-gray-500 dark:text-gray-400 mt-1">{taches.length} {t("task")}</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {["", "en_attente", "en_cours", "terminee"].map((val) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-2 rounded-xl font-body text-sm font-medium transition border ${filter === val ? "bg-emerald-600 text-white border-emerald-600" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-emerald-300"}`}>
            {val === "" ? t("allStatuses") : statutConfig[val as keyof typeof statutConfig]?.label(t)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-emerald-500" /></div>
      ) : taches.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-12 text-center">
          <ClipboardList className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="font-body text-gray-500 dark:text-gray-400">{t("noTasks")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {taches.map((tache) => {
            const cfg = statutConfig[tache.statut];
            const Icon = cfg.icon;
            const isOpen = expanded === tache.id;
            return (
              <div key={tache.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border ${cfg.cls}`}>
                          <Icon className="h-3 w-3" /> {cfg.label(t)}
                        </span>
                        {tache.confirme_par_admin ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                            <CheckCircle className="h-3 w-3" /> {t("confirmedByAdmin")}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 dark:text-gray-500 px-2 py-1 rounded-lg border border-dashed border-gray-200 dark:border-gray-600">
                            {t("notConfirmed")}
                          </span>
                        )}
                        {tache.ambulance && (
                          <span className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                            🚑 {tache.ambulance.immatriculation}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-semibold text-gray-900 dark:text-white">{tache.titre}</h3>
                      <p className="font-body text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{tache.description}</p>
                      <div className="flex flex-wrap gap-3 mt-2 font-body text-xs text-gray-400 dark:text-gray-500">
                        <span>📅 {tache.date_debut}</span>
                        {tache.date_fin && <span>→ {tache.date_fin}</span>}
                      </div>
                    </div>
                    <button onClick={() => setExpanded(isOpen ? null : tache.id)}
                      className="p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-400 transition shrink-0">
                      {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isOpen && (
                  <div className="px-5 pb-5 space-y-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                    {tache.notes_admin && (
                      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 rounded-xl p-3">
                        <p className="font-body text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">{t("adminNotes")}</p>
                        <p className="font-body text-sm text-amber-800 dark:text-amber-300">{tache.notes_admin}</p>
                      </div>
                    )}

                    {/* Status update buttons (only if confirmed by admin) */}
                    {tache.confirme_par_admin && tache.statut !== "terminee" && (
                      <div className="flex flex-wrap gap-2">
                        <p className="w-full font-body text-xs text-gray-500 dark:text-gray-400 font-medium">{t("status")} :</p>
                        {tache.statut === "en_attente" && (
                          <button onClick={() => updateStatut(tache.id, "en_cours")}
                            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-body text-sm font-medium hover:bg-blue-700 transition">
                            → {t("inProgressTasks")}
                          </button>
                        )}
                        {tache.statut === "en_cours" && (
                          <button onClick={() => updateStatut(tache.id, "terminee")}
                            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-body text-sm font-medium hover:bg-emerald-700 transition">
                            ✓ {t("completedTasks")}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChauffeurTaches;
