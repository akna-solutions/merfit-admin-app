import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import {
  lightThemeTokens,
  darkThemeTokens,
  componentTokens,
} from "./themeTokens";

const STORAGE_KEY = "merfit-admin-theme";

const ThemeModeContext = createContext({
  mode: "light",
  toggleMode: () => {},
  setMode: () => {},
});

function getInitialMode() {
  if (typeof window === "undefined") return "light";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch (err) {
    // localStorage unavailable (privacy mode, etc.) — fall back silently
  }
  return "light";
}

export function ThemeModeProvider({ children }) {
  const [mode, setModeState] = useState(getInitialMode);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch (err) {
      // ignore write failures
    }
    document.documentElement.setAttribute("data-theme", mode);
  }, [mode]);

  const setMode = useCallback((next) => {
    setModeState(next);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const contextValue = useMemo(
    () => ({ mode, toggleMode, setMode }),
    [mode, toggleMode, setMode],
  );

  const antdConfig = useMemo(() => {
    const isDark = mode === "dark";
    return {
      algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: isDark ? darkThemeTokens : lightThemeTokens,
      components: componentTokens(mode),
    };
  }, [mode]);

  return (
    <ThemeModeContext.Provider value={contextValue}>
      <ConfigProvider theme={antdConfig}>{children}</ConfigProvider>
    </ThemeModeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeModeContext);
}
