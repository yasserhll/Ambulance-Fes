import React, { createContext, useContext, useState, useEffect } from "react";
import translations, { Lang, TranslationKey } from "@/i18n/translations";

// ─── Language Context ────────────────────────────────────────────────────────
interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
  isRtl: boolean;
}

const LangContext = createContext<LangCtx>({
  lang: "fr",
  setLang: () => {},
  t: (k) => k,
  isRtl: false,
});

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem("lang") as Lang) || "fr";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  const t = (key: TranslationKey): string => {
    return translations[lang][key] || translations["fr"][key] || key;
  };

  const isRtl = lang === "ar";

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  return (
    <LangContext.Provider value={{ lang, setLang, t, isRtl }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);

// ─── Theme Context ────────────────────────────────────────────────────────────
interface ThemeCtx {
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeCtx>({
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const toggleTheme = () => {
    setIsDark((d) => {
      const next = !d;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

// ─── Chauffeur Auth Context ───────────────────────────────────────────────────
export interface ChauffeurUser {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  statut: string;
  ambulance?: { id: number; immatriculation: string };
}

interface ChauffeurAuthCtx {
  chauffeur: ChauffeurUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const ChauffeurAuthContext = createContext<ChauffeurAuthCtx>({
  chauffeur: null,
  isLoggedIn: false,
  login: async () => {},
  logout: async () => {},
});

export const ChauffeurAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [chauffeur, setChauffeur] = useState<ChauffeurUser | null>(() => {
    const raw = localStorage.getItem("chauffeur_user");
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const isLoggedIn = !!chauffeur && !!localStorage.getItem("chauffeur_token");

  const login = async (email: string, password: string) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/chauffeur/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );
    if (!res.ok) {
      const data = await res.json();
      throw new Error(
        data?.message ||
          data?.errors?.email?.[0] ||
          "Email ou mot de passe incorrect."
      );
    }
    const data = await res.json();
    localStorage.setItem("chauffeur_token", data.token);
    localStorage.setItem("chauffeur_user", JSON.stringify(data.chauffeur));
    setChauffeur(data.chauffeur);
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("chauffeur_token");
      if (token) {
        await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8000/api"}/chauffeur/logout`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
    } catch {}
    localStorage.removeItem("chauffeur_token");
    localStorage.removeItem("chauffeur_user");
    setChauffeur(null);
  };

  return (
    <ChauffeurAuthContext.Provider
      value={{ chauffeur, isLoggedIn, login, logout }}
    >
      {children}
    </ChauffeurAuthContext.Provider>
  );
};

export const useChauffeurAuth = () => useContext(ChauffeurAuthContext);
