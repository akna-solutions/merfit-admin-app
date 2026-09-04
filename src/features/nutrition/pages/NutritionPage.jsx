import React from "react";
import { Tabs } from "antd";
import { PageHeader, PageContainer } from "../../../components/admin";
import FoodsTab from "../components/FoodsTab";
import NutritionOverviewTab from "../components/NutritionOverviewTab";

export default function NutritionPage() {
  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: "Panel", path: "/admin" }, { label: "Beslenme" }]}
        title="Beslenme"
        description="Besin kataloğunu yönetin ve beslenme etkinliğini inceleyin."
      />
      <Tabs
        defaultActiveKey="foods"
        items={[
          { key: "foods", label: "Besinler", children: <FoodsTab /> },
          { key: "overview", label: "Beslenme Genel Bakış", children: <NutritionOverviewTab /> },
        ]}
      />
    </PageContainer>
  );
}
