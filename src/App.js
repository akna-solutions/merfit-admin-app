import React from "react";
import { BrowserRouter } from "react-router-dom";
import { App as AntApp } from "antd";
import { ThemeModeProvider } from "./theme/ThemeContext";
import { AuthProvider } from "./features/auth/context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  return (
    <ThemeModeProvider>
      <AntApp>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </AntApp>
    </ThemeModeProvider>
  );
}

export default App;
