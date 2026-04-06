import { useEffect, useState } from "react";
import api from "@/lib/api";
import { useLang } from "@/contexts/AppContexts";
import { UserCog, Plus, Loader2, X, Check, KeyRound, Trash2, UserCheck, UserX, Eye, EyeOff } from "lucide-react";

interface Chauffeur {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  statut: string;
  email?: string;
  has_account: boolean;
  ambulance?: { immatriculation: string };
}

const AccountsPage = () => {
  const { t } = useLang();
  const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ type: "create" | "reset"; chauffeur: Chauffeur } | null>(null);
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const load = () => {
    setLoading(true);
    api.get("/chauffeurs?with_account=1")
      .then(r => setChauffeurs(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openCreate = (c: Chauffeur) => {
    setForm({ email: c.email || `${c.prenom.toLowerCase()}.${c.nom.toLowerCase()}@ambulancefes.ma`, password: "", confirm: "" });
    setError(""); setSuccess("");
    setModal({ type: "create", chauffeur: c });
  };

  const openReset = (c: Chauffeur) => {
    setForm({ email: c.email || "", password: "", confirm: "" });
    setError(""); setSuccess("");
    setModal({ type: "reset", chauffeur: c });
  };

  const handleSave = async () => {
    if (form.password !== form.confirm) { setError(t("passwordMismatch")); return; }
    if (form.password.length < 6) { setError("Le mot de passe doit avoir au moins 6 caractères."); return; }
    setSaving(true); setError("");
    try {
      const endpoint = modal!.type === "create"
        ? `/chauffeurs/${modal!.chauffeur.id}/account`
        : `/chauffeurs/${modal!.chauffeur.id}/account/reset`;
      await api.post(endpoint, { email: form.email, password: form.password });
      setSuccess(modal!.type === "create" ? t("accountCreated") : t("passwordUpdated"));
      setTimeout(() => { setModal(null); setSuccess(""); load(); }, 1500);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Erreur.");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("confirmDelete"))) return;
    await api.delete(`/chauffeurs/${id}/account`);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground dark:text-white flex items-center gap-3">
          <UserCog className="h-6 w-6 text-primary" /> {t("accountsManagement")}
        </h1>
        <p className="font-body text-sm text-muted-foreground mt-1">{t("accountsSubtitle")}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: t("accountExists"), value: chauffeurs.filter(c => c.has_account).length, icon: UserCheck, color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" },
          { label: t("noAccount"),     value: chauffeurs.filter(c => !c.has_account).length, icon: UserX,    color: "bg-gray-100 text-gray-600 dark:bg-gray-700/50 dark:text-gray-400" },
          { label: "Total",            value: chauffeurs.length,                              icon: UserCog,  color: "bg-primary/10 text-primary" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card dark:bg-gray-800 border border-border dark:border-gray-700 rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-body text-xs text-muted-foreground">{label}</p>
              <p className="font-display text-xl font-bold text-foreground dark:text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
      ) : (
        <div className="bg-card dark:bg-gray-800 border border-border dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border dark:border-gray-700 bg-muted/40 dark:bg-gray-750">
                  {[t("driver"), t("phone"), t("ambulance"), t("status"), "Email", t("accountExists"), t("actions")].map(h => (
                    <th key={h} className="text-left font-body text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chauffeurs.map(c => (
                  <tr key={c.id} className="border-b border-border dark:border-gray-700/50 last:border-0 hover:bg-muted/20 dark:hover:bg-gray-750 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-display text-xs font-bold text-primary">{c.prenom[0]}{c.nom[0]}</span>
                        </div>
                        <p className="font-body text-sm font-semibold text-foreground dark:text-white">{c.prenom} {c.nom}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground">{c.telephone}</td>
                    <td className="px-4 py-3 font-body text-sm text-muted-foreground">{c.ambulance?.immatriculation || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-lg bg-muted text-muted-foreground">{c.statut}</span>
                    </td>
                    <td className="px-4 py-3 font-body text-xs text-muted-foreground">{c.email || "—"}</td>
                    <td className="px-4 py-3">
                      {c.has_account ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
                          <UserCheck className="h-3 w-3" /> {t("accountExists")}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">{t("noAccount")}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {!c.has_account ? (
                          <button onClick={() => openCreate(c)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-body text-xs font-semibold hover:bg-primary/90 transition">
                            <Plus className="h-3 w-3" /> {t("createAccount")}
                          </button>
                        ) : (
                          <>
                            <button onClick={() => openReset(c)}
                              className="p-1.5 rounded-lg hover:bg-muted dark:hover:bg-gray-700 text-muted-foreground hover:text-foreground transition" title={t("resetPassword")}>
                              <KeyRound className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDelete(c.id)}
                              className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition" title={t("deleteAccount")}>
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
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
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-card dark:bg-gray-900 border border-border dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border dark:border-gray-700">
              <div>
                <h2 className="font-display font-bold text-lg text-foreground dark:text-white">
                  {modal.type === "create" ? t("createAccount") : t("resetPassword")}
                </h2>
                <p className="font-body text-sm text-muted-foreground">{modal.chauffeur.prenom} {modal.chauffeur.nom}</p>
              </div>
              <button onClick={() => setModal(null)} className="p-2 rounded-xl hover:bg-muted dark:hover:bg-gray-700 transition text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {modal.type === "create" && (
                <div>
                  <label className="block font-body text-xs font-medium text-muted-foreground mb-1">{t("email")} *</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border dark:border-gray-600 bg-background dark:bg-gray-800 text-foreground dark:text-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
                </div>
              )}
              <div>
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">{t("newPassword")} *</label>
                <div className="relative">
                  <input type={showPwd ? "text" : "password"} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full px-3 py-2.5 pr-10 rounded-xl border border-border dark:border-gray-600 bg-background dark:bg-gray-800 text-foreground dark:text-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition">
                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block font-body text-xs font-medium text-muted-foreground mb-1">{t("confirmPassword")} *</label>
                <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-border dark:border-gray-600 bg-background dark:bg-gray-800 text-foreground dark:text-white font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition" />
              </div>
              {error && <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 font-body text-sm">{error}</div>}
              {success && <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-xl px-4 py-3 font-body text-sm flex items-center gap-2"><Check className="h-4 w-4" />{success}</div>}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border dark:border-gray-700">
              <button onClick={() => setModal(null)} className="px-4 py-2 rounded-xl border border-border dark:border-gray-600 font-body text-sm text-foreground dark:text-gray-300 hover:bg-muted dark:hover:bg-gray-700 transition">{t("cancel")}</button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-body text-sm font-semibold hover:bg-primary/90 disabled:opacity-60 transition">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {t("save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsPage;
