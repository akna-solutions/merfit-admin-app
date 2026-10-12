import React from "react";
import { Tabs } from "antd";
import { PageHeader, PageContainer } from "../../../components/admin";
import CampaignsTab from "../components/CampaignsTab";
import RulesTab from "../components/RulesTab";
import TemplatesTab from "../components/TemplatesTab";
import MonthlyRewardsTab from "../components/MonthlyRewardsTab";
import DispatchesTab from "../components/DispatchesTab";
import NotificationHistoryTab from "../components/NotificationHistoryTab";

export default function NotificationsPage() {
  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: "Kontrol Paneli", path: "/admin" }, { label: "Bildirimler" }]}
        title="Bildirimler"
        description="Duyuru kampanyaları, otomatik hatırlatıcı kuralları, şablonlar, aylık ödül bildirimleri ve gönderim sonuçları."
      />

      <Tabs
        defaultActiveKey="campaigns"
        destroyOnHidden
        items={[
          { key: "campaigns", label: "Kampanyalar", children: <CampaignsTab /> },
          { key: "rules", label: "Otomatik Kurallar", children: <RulesTab /> },
          { key: "templates", label: "Şablonlar", children: <TemplatesTab /> },
          { key: "monthly", label: "Aylık Ödüller", children: <MonthlyRewardsTab /> },
          { key: "dispatches", label: "Gönderim Kayıtları", children: <DispatchesTab /> },
          { key: "history", label: "Uygulama İçi Kutu", children: <NotificationHistoryTab /> },
        ]}
      />
    </PageContainer>
  );
}
