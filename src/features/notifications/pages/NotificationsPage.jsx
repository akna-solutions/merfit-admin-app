import React, { useState } from "react";
import { Alert, Segmented, Tabs } from "antd";
import { PageHeader, PageContainer } from "../../../components/admin";
import CampaignsTab from "../components/CampaignsTab";
import RulesTab from "../components/RulesTab";
import TemplatesTab from "../components/TemplatesTab";
import MonthlyRewardsTab from "../components/MonthlyRewardsTab";
import DispatchesTab from "../components/DispatchesTab";
import NotificationHistoryTab from "../components/NotificationHistoryTab";
import { APP_LABELS } from "../utils/notificationLabels";

const APP_STORAGE_KEY = "mbfit.notifications.app";

function readStoredApp() {
  try {
    return window.localStorage.getItem(APP_STORAGE_KEY) === "MbShop" ? "MbShop" : "MbFit";
  } catch {
    return "MbFit";
  }
}

/**
 * MB FIT ve MB Shop bildirimleri ayri yonetilir: ust kisimdaki secim tum sekmeleri (kampanya, sablon,
 * gonderim kaydi, uygulama ici kutu) o uygulamanin bildirimlerine indirger. Mobilde de ayri gelen
 * kutularinda, ayri ayarlarda ve ayri Android bildirim kanalinda gorunurler.
 */
export default function NotificationsPage() {
  const [app, setApp] = useState(readStoredApp);

  const changeApp = (value) => {
    setApp(value);
    try {
      window.localStorage.setItem(APP_STORAGE_KEY, value);
    } catch {
      // Tercih hatirlanamazsa varsayilan MB FIT ile acilir.
    }
  };

  const isShop = app === "MbShop";
  const items = isShop
    ? [
        { key: "campaigns", label: "Kampanyalar", children: <CampaignsTab app={app} /> },
        { key: "templates", label: "Şablonlar", children: <TemplatesTab app={app} /> },
        { key: "dispatches", label: "Gönderim Kayıtları", children: <DispatchesTab app={app} /> },
        { key: "history", label: "Uygulama İçi Kutu", children: <NotificationHistoryTab app={app} /> },
      ]
    : [
        { key: "campaigns", label: "Kampanyalar", children: <CampaignsTab app={app} /> },
        { key: "rules", label: "Otomatik Kurallar", children: <RulesTab /> },
        { key: "templates", label: "Şablonlar", children: <TemplatesTab app={app} /> },
        { key: "monthly", label: "Aylık Ödüller", children: <MonthlyRewardsTab /> },
        { key: "dispatches", label: "Gönderim Kayıtları", children: <DispatchesTab app={app} /> },
        { key: "history", label: "Uygulama İçi Kutu", children: <NotificationHistoryTab app={app} /> },
      ];

  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: "Kontrol Paneli", path: "/admin" }, { label: "Bildirimler" }]}
        title="Bildirimler"
        description={
          isShop
            ? "MB Shop bildirimleri: mağaza kampanyaları, şablonlar, sipariş durumu bildirimleri ve gönderim sonuçları."
            : "Duyuru kampanyaları, otomatik hatırlatıcı kuralları, şablonlar, aylık ödül bildirimleri ve gönderim sonuçları."
        }
        actions={
          <Segmented
            value={app}
            onChange={changeApp}
            options={[
              { value: "MbFit", label: APP_LABELS.MbFit },
              { value: "MbShop", label: APP_LABELS.MbShop },
            ]}
          />
        }
      />

      {isShop && (
        <Alert
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
          message="MB Shop bildirimleri MB FIT bildirimlerinden ayrıdır."
          description="Kullanıcılar bunları uygulamada MB Shop'un kendi bildirim kutusunda görür ve ayrı ayarlardan açıp kapatır. Sipariş durumu bildirimleri (hazırlanıyor, kargoya verildi, teslim edildi, iptal, ödeme) siparişin durumunu değiştirdiğinizde otomatik gönderilir. MB Shop kampanyaları yalnızca bu türe izin veren kullanıcılara gider."
        />
      )}

      <Tabs key={app} defaultActiveKey="campaigns" destroyOnHidden items={items} />
    </PageContainer>
  );
}
