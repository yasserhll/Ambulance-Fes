import { useEffect, useState } from "react";
import { useLang } from "@/contexts/AppContexts";
import { Clock, Loader2, Calendar, TrendingUp } from "lucide-react";

const chauffeurApi = async (path: string) => {
  const token = localStorage.getItem("chauffeur_token");
  const base = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  const res = await fetch(`${base}${path}`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("API error");
  return res.json();
};

interface Heure {
  id: number;
  date: string;
  heure_debut: string;
  heure_fin: string;
  duree_heures: number;
  type: string;
  notes?: string;
}

const ChauffeurHeures = () => {
  const { t } = useLang();
  const [heures, setHeures] = useState<Heure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chauffeurApi("/chauffeur/heures")
      .then(setHeures)
      .catch(() => setHeures([]))
      .finally(() => setLoading(false));
  }, []);

  const totalMois = heures.reduce((acc, h) => acc + (h.duree_heures || 0), 0);
  const totalInterventions = heures.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">{t("myHours")}</h1>
        <p className="font-body text-sm text-gray-500 dark:text-gray-400 mt-1">{heures.length} {t("workHoursCount")}</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
            <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="font-body text-xs text-gray-500 dark:text-gray-400">{t("hoursThisMonthDriver")}</p>
            <p className="font-display text-2xl font-bold text-gray-900 dark:text-white">{totalMois.toFixed(1)}h</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-body text-xs text-gray-500 dark:text-gray-400">{t("totalInterventions")}</p>
            <p className="font-display text-2xl font-bold text-gray-900 dark:text-white">{totalInterventions}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-emerald-500" /></div>
      ) : heures.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-12 text-center">
          <Calendar className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="font-body text-gray-500 dark:text-gray-400">{t("noHours")}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                  {[t("date"), t("startTime"), t("endTime"), t("duration"), t("type")].map(h => (
                    <th key={h} className="text-left font-body text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heures.map((h) => (
                  <tr key={h.id} className="border-b border-gray-50 dark:border-gray-700/50 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-750 transition">
                    <td className="px-4 py-3 font-body text-sm text-gray-900 dark:text-white font-medium">{h.date}</td>
                    <td className="px-4 py-3 font-body text-sm text-gray-600 dark:text-gray-300">{h.heure_debut}</td>
                    <td className="px-4 py-3 font-body text-sm text-gray-600 dark:text-gray-300">{h.heure_fin}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
                        <Clock className="h-3 w-3" /> {h.duree_heures}h
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                        {h.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChauffeurHeures;
