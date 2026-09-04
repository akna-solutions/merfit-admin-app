import React, { useState } from "react";
import { Form, Segmented, Switch, Select, App } from "antd";
import { SectionCard } from "../../../components/admin";
import { useThemeMode } from "../../../theme/ThemeContext";

export default function AppearanceSettingsTab() {
  const { message } = App.useApp();
  const { mode, toggleMode } = useThemeMode();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [density, setDensity] = useState("comfortable");

  return (
    <SectionCard>
      <Form layout="vertical" style={{ maxWidth: 480 }}>
        <Form.Item label="Tema">
          {/* Wired to the app's real theme system — flipping this actually
              switches the whole admin panel's light/dark mode. */}
          <Segmented
            value={mode}
            onChange={(value) => {
              if (value !== mode) toggleMode();
            }}
            options={[
              { label: "Açık", value: "light" },
              { label: "Koyu", value: "dark" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Kenar Çubuğu Varsayılan Olarak Daraltılmış">
          <Switch
            checked={sidebarCollapsed}
            onChange={(checked) => {
              setSidebarCollapsed(checked);
              message.info("Kaydedildi (mock — henüz backend yok).");
            }}
          />
        </Form.Item>
        <Form.Item label="Yoğunluk">
          <Select
            value={density}
            onChange={(value) => {
              setDensity(value);
              message.info("Kaydedildi (mock — henüz backend yok).");
            }}
            options={[
              { value: "compact", label: "Sıkışık" },
              { value: "comfortable", label: "Rahat" },
            ]}
          />
        </Form.Item>
      </Form>
    </SectionCard>
  );
}
