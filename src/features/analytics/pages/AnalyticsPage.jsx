import React from "react";
import { Tabs } from "antd";
import { PageHeader, PageContainer } from "../../../components/admin";
import UsersAnalyticsTab from "../components/UsersAnalyticsTab";
import WorkoutsAnalyticsTab from "../components/WorkoutsAnalyticsTab";
import NutritionAnalyticsTab from "../components/NutritionAnalyticsTab";
import SubscriptionsAnalyticsTab from "../components/SubscriptionsAnalyticsTab";
import RevenueAnalyticsTab from "../components/RevenueAnalyticsTab";
import RetentionAnalyticsTab from "../components/RetentionAnalyticsTab";
import EngagementAnalyticsTab from "../components/EngagementAnalyticsTab";

// Every tab here maps 1:1 to a read-only AdminAnalyticsController endpoint,
// each returning one current snapshot object with no date-range or
// granularity parameters — there's no historical time-series endpoint yet,
// so this is a snapshot KPI dashboard rather than trend charts.
export default function AnalyticsPage() {
  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: "Kontrol Paneli", path: "/admin" }, { label: "Analitik" }]}
        title="Analitik"
        description="Uygulama genelindeki anlık metrikler."
      />
      <Tabs
        defaultActiveKey="users"
        items={[
          { key: "users", label: "Kullanıcılar", children: <UsersAnalyticsTab /> },
          { key: "workouts", label: "Antrenmanlar", children: <WorkoutsAnalyticsTab /> },
          { key: "nutrition", label: "Beslenme", children: <NutritionAnalyticsTab /> },
          { key: "subscriptions", label: "Abonelikler", children: <SubscriptionsAnalyticsTab /> },
          { key: "revenue", label: "Gelir", children: <RevenueAnalyticsTab /> },
          { key: "retention", label: "Elde Tutma", children: <RetentionAnalyticsTab /> },
          { key: "engagement", label: "Etkileşim", children: <EngagementAnalyticsTab /> },
        ]}
      />
    </PageContainer>
  );
}
