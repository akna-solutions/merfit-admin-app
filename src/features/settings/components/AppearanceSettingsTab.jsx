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
        <Form.Item label="Theme">
          {/* Wired to the app's real theme system — flipping this actually
              switches the whole admin panel's light/dark mode. */}
          <Segmented
            value={mode}
            onChange={(value) => {
              if (value !== mode) toggleMode();
            }}
            options={[
              { label: "Light", value: "light" },
              { label: "Dark", value: "dark" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Sidebar Collapsed by Default">
          <Switch
            checked={sidebarCollapsed}
            onChange={(checked) => {
              setSidebarCollapsed(checked);
              message.info("Saved (mock — no backend yet).");
            }}
          />
        </Form.Item>
        <Form.Item label="Density">
          <Select
            value={density}
            onChange={(value) => {
              setDensity(value);
              message.info("Saved (mock — no backend yet).");
            }}
            options={[
              { value: "compact", label: "Compact" },
              { value: "comfortable", label: "Comfortable" },
            ]}
          />
        </Form.Item>
      </Form>
    </SectionCard>
  );
}
