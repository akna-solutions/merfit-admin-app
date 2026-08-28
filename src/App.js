import React from "react";
import { BrowserRouter } from "react-router-dom";
import { App as AntApp } from "antd";
import { ThemeModeProvider } from "./theme/ThemeContext";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  return (
    <ThemeModeProvider>
      <AntApp>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AntApp>
    </ThemeModeProvider>
  );
}

export default App;
