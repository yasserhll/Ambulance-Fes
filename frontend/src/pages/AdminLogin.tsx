import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, AlertCircle, Shield, ArrowRight } from "lucide-react";
import { loginAdmin } from "@/lib/auth";
import heroImg from "@/assets/hero-ambulance.jpg";
import logo from "@/assets/logo.png";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    // Simulate brief loading for UX
    await new Promise(r => setTimeout(r, 600));
    
    if (loginAdmin(email, password)) {
      navigate("/admin");
    } else {
      setError("Email ou mot de passe incorrect.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={heroImg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/90 via-secondary/70 to-primary/40" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-1 w-12 bg-primary rounded-full" />
              <span className="font-body text-sm text-primary-foreground/80 uppercase tracking-widest">Administration</span>
            </div>
            <h2 className="font-display text-4xl font-bold text-primary-foreground leading-tight mb-4">
              Gérez votre flotte<br />
              <span className="text-primary">en toute simplicité</span>
            </h2>
            <p className="font-body text-primary-foreground/70 max-w-md leading-relaxed">
              Tableau de bord complet pour le suivi des ambulances, la maintenance, les heures de travail et la gestion des incidents.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center bg-background relative">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }} />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md mx-8"
        >
          {/* Logo & Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary shadow-xl mb-6"
            >
              <img src={logo} alt="Logo" className="h-12 w-12" />
            </motion.div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Espace Administration
            </h1>
            <p className="font-body text-muted-foreground">
              Connectez-vous pour accéder au panneau de gestion
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="flex items-center gap-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 mb-6"
              >
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span className="font-body text-sm font-medium">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="font-body text-sm font-semibold text-foreground block">
                Adresse email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-border bg-card font-body text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-body text-sm font-semibold text-foreground block">
                Mot de passe
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-border bg-card font-body text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-muted-foreground/50"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground font-display font-bold text-base px-6 py-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-70"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  Se Connecter
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="font-body text-xs text-muted-foreground">
              Accès réservé au personnel autorisé
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
