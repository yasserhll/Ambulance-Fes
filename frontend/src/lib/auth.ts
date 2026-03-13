const ADMIN_EMAIL = "adminambulance@gmail.com";
const ADMIN_PASSWORD = "admin@123";
const AUTH_KEY = "ambulance_admin_auth";

export const loginAdmin = (email: string, password: string): boolean => {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ email, loggedIn: true, timestamp: Date.now() }));
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const isAdminLoggedIn = (): boolean => {
  const auth = localStorage.getItem(AUTH_KEY);
  if (!auth) return false;
  try {
    const parsed = JSON.parse(auth);
    return parsed.loggedIn === true;
  } catch {
    return false;
  }
};
