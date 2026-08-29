import React from "react";
import { Tabs } from "antd";
import { PageHeader, PageContainer } from "../../../components/admin";
import CategoriesTab from "../components/CategoriesTab";
import FaqsTab from "../components/FaqsTab";

export default function FaqPage() {
  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: "Dashboard", path: "/admin" }, { label: "FAQ" }]}
        title="FAQ"
        description="Manage FAQ categories and questions."
      />
      <Tabs
        defaultActiveKey="categories"
        items={[
          { key: "categories", label: "Categories", children: <CategoriesTab /> },
          { key: "faqs", label: "FAQs", children: <FaqsTab /> },
        ]}
      />
    </PageContainer>
  );
}
