import React from "react";
import { Tabs } from "antd";
import { PageHeader, PageContainer } from "../../../components/admin";
import FoodsTab from "../components/FoodsTab";
import NutritionOverviewTab from "../components/NutritionOverviewTab";

export default function NutritionPage() {
  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: "Dashboard", path: "/admin" }, { label: "Nutrition" }]}
        title="Nutrition"
        description="Manage the food catalog and review nutrition activity."
      />
      <Tabs
        defaultActiveKey="foods"
        items={[
          { key: "foods", label: "Foods", children: <FoodsTab /> },
          { key: "overview", label: "Nutrition Overview", children: <NutritionOverviewTab /> },
        ]}
      />
    </PageContainer>
  );
}
