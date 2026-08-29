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
        crumbs={[{ label: "Dashboard", path: "/admin" }, { label: "AI" }]}
        title="AI"
        description="Review AI generation requests, results and usage statistics."
      />
      <Tabs
        defaultActiveKey="requests"
        items={[
          { key: "requests", label: "Requests", children: <RequestsTab /> },
          { key: "results", label: "Results", children: <ResultsTab /> },
          { key: "statistics", label: "Statistics", children: <StatisticsTab /> },
        ]}
      />
    </PageContainer>
  );
}
