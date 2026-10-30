import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { SESSION_EXPIRED_EVENT, tokenStore } from "../../../utils/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => tokenStore.getAccessToken());
  const [user, setUser] = useState(null);
  // "checking" covers the initial silent session restore on page load;
  // "idle" once we know whether there's a valid session or not.
  const [status, setStatus] = useState("checking");
  const [error, setError] = useState(null);

  const restoreSession = useCallback(async () => {
    try {
      // Saklı oturumla çağrılır: access token'ın süresi dolmuşsa apiClient refresh token ile yeniler.
      const me = await authService.me();
      setAccessToken(tokenStore.getAccessToken());
      setUser(me);
      setStatus("authenticated");
    } catch {
      tokenStore.clear();
      setAccessToken(null);
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  useEffect(() => {
    if (accessToken || tokenStore.getRefreshToken()) {
      restoreSession();
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
    // "Beni hatırla" kapalıysa oturum sekme kapanana kadar sessionStorage'da tutulur.
    tokenStore.save(auth, { remember: Boolean(remember) });
    setAccessToken(auth.accessToken);
    setUser(me);
    setStatus("authenticated");
    return me;
  }, []);

  const logout = useCallback(() => {
    tokenStore.clear();
    setAccessToken(null);
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  // Refresh token da geçersizse (30 gün dolmuş, şifre değişmiş vb.) apiClient bu olayı yayar; giriş ekranına dönülür.
  useEffect(() => {
    window.addEventListener(SESSION_EXPIRED_EVENT, logout);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, logout);
  }, [logout]);

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
