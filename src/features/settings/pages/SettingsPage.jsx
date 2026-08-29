import React from "react";
import { Tabs } from "antd";
import { PageHeader, PageContainer } from "../../../components/admin";
import GeneralSettingsTab from "../components/GeneralSettingsTab";
import AppearanceSettingsTab from "../components/AppearanceSettingsTab";
import NotificationSettingsTab from "../components/NotificationSettingsTab";
import SecuritySettingsTab from "../components/SecuritySettingsTab";

// No AdminSettingsController exists in the API yet, so every tab here is
// local mock state only — consistent with the original spec's own note
// that no real backend work is needed at this stage.
export default function SettingsPage() {
  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: "Dashboard", path: "/admin" }, { label: "Settings" }]}
        title="Settings"
        description="Admin panel preferences."
      />
      <Tabs
        defaultActiveKey="general"
        items={[
          { key: "general", label: "General", children: <GeneralSettingsTab /> },
          { key: "appearance", label: "Appearance", children: <AppearanceSettingsTab /> },
          { key: "notifications", label: "Notifications", children: <NotificationSettingsTab /> },
          { key: "security", label: "Security", children: <SecuritySettingsTab /> },
        ]}
      />
    </PageContainer>
  );
}
