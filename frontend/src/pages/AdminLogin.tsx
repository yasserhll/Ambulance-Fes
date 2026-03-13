import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "@/lib/auth";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import logo from "@/assets/logo.png";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@ambulancefes.ma");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await loginAdmin(email, password);
      navigate("/admin");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.email?.[0] ||
        "Email ou mot de passe incorrect.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center ring-2 ring-primary/20 mb-3">
              <img src={logo} alt="Logo" className="h-10 w-10" />
            </div>
            <h1 className="font-display font-bold text-2xl text-foreground">
              Ambulance <span className="text-primary">Fès</span>
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <Shield className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-body text-sm text-muted-foreground">
                Espace Administration
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block font-body text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                placeholder="admin@ambulancefes.ma"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-body text-sm font-medium text-foreground mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 font-body text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground font-body font-semibold text-sm px-4 py-3 rounded-xl transition"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
        </div>

        <p className="text-center font-body text-xs text-muted-foreground mt-6">
          <a href="/" className="hover:text-foreground transition">
            ← Retour au site
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
