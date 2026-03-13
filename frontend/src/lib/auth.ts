import api from "./api";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
}

/**
 * Login — appelle POST /api/auth/login
 * Stocke le token Bearer dans localStorage
 */
export async function loginAdmin(
  email: string,
  password: string
): Promise<AdminUser> {
  const { data } = await api.post("/auth/login", { email, password });
  localStorage.setItem("admin_token", data.token);
  localStorage.setItem("admin_user", JSON.stringify(data.user));
  return data.user;
}

/**
 * Logout — appelle POST /api/auth/logout puis nettoie le storage
 */
export async function logoutAdmin(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch (_) {
    // ignore si déjà expiré
  } finally {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
  }
}

/**
 * Vérifie si un token est présent en localStorage
 */
export function isAdminLoggedIn(): boolean {
  return !!localStorage.getItem("admin_token");
}

/**
 * Retourne l'utilisateur stocké (sans appel API)
 */
export function getAdminUser(): AdminUser | null {
  const raw = localStorage.getItem("admin_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminUser;
  } catch {
    return null;
  }
}
