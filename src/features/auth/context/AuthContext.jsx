import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";

const STORAGE_KEY = "mbfit_admin_access_token";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState(null);
  // "checking" covers the initial silent session restore on page load;
  // "idle" once we know whether there's a valid session or not.
  const [status, setStatus] = useState("checking");
  const [error, setError] = useState(null);

  const restoreSession = useCallback(async (token) => {
    try {
      const me = await authService.me(token);
      setUser(me);
      setStatus("authenticated");
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setAccessToken(null);
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      restoreSession(accessToken);
    } else {
      setStatus("unauthenticated");
    }
    // Only run once on mount — subsequent token changes go through login()/logout().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async ({ emailOrUsername, password, remember }) => {
    setError(null);
    const auth = await authService.login({ emailOrUsername, password });
    // The real /api/admin/auth/me call is what actually gates admin access
    // (role check) — login itself just proves the credentials are valid.
    const me = await authService.me(auth.accessToken);
    if (remember) {
      localStorage.setItem(STORAGE_KEY, auth.accessToken);
    }
    setAccessToken(auth.accessToken);
    setUser(me);
    setStatus("authenticated");
    return me;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAccessToken(null);
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated: status === "authenticated",
      isChecking: status === "checking",
      error,
      login,
      logout,
    }),
    [user, accessToken, status, error, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
