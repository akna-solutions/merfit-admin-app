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
        crumbs={[{ label: "Kontrol Paneli", path: "/admin" }, { label: "Ayarlar" }]}
        title="Ayarlar"
        description="Yönetici paneli tercihleri."
      />
      <Tabs
        defaultActiveKey="general"
        items={[
          { key: "general", label: "Genel", children: <GeneralSettingsTab /> },
          { key: "appearance", label: "Görünüm", children: <AppearanceSettingsTab /> },
          { key: "notifications", label: "Bildirimler", children: <NotificationSettingsTab /> },
          { key: "security", label: "Güvenlik", children: <SecuritySettingsTab /> },
        ]}
      />
    </PageContainer>
  );
}
