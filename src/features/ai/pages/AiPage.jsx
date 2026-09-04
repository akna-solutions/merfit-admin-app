import React from "react";
import { Tabs } from "antd";
import { PageHeader, PageContainer } from "../../../components/admin";
import RequestsTab from "../components/RequestsTab";
import ResultsTab from "../components/ResultsTab";
import StatisticsTab from "../components/StatisticsTab";

export default function AiPage() {
  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: "Kontrol Paneli", path: "/admin" }, { label: "Yapay Zeka" }]}
        title="Yapay Zeka"
        description="Yapay zeka üretim isteklerini, sonuçlarını ve kullanım istatistiklerini inceleyin."
      />
      <Tabs
        defaultActiveKey="requests"
        items={[
          { key: "requests", label: "İstekler", children: <RequestsTab /> },
          { key: "results", label: "Sonuçlar", children: <ResultsTab /> },
          { key: "statistics", label: "İstatistikler", children: <StatisticsTab /> },
        ]}
      />
    </PageContainer>
  );
}
