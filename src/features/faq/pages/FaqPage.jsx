import React from "react";
import { Tabs } from "antd";
import { PageHeader, PageContainer } from "../../../components/admin";
import CategoriesTab from "../components/CategoriesTab";
import FaqsTab from "../components/FaqsTab";

export default function FaqPage() {
  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: "Panel", path: "/admin" }, { label: "SSS" }]}
        title="SSS"
        description="SSS kategorilerini ve sorularını yönetin."
      />
      <Tabs
        defaultActiveKey="categories"
        items={[
          { key: "categories", label: "Kategoriler", children: <CategoriesTab /> },
          { key: "faqs", label: "SSS'ler", children: <FaqsTab /> },
        ]}
      />
    </PageContainer>
  );
}
