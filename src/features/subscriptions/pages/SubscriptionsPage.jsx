import React from "react";
import { Tabs } from "antd";
import { PageHeader, PageContainer } from "../../../components/admin";
import ProductsTab from "../components/ProductsTab";
import SubscriptionsTab from "../components/SubscriptionsTab";
import TransactionsTab from "../components/TransactionsTab";

export default function SubscriptionsPage() {
  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: "Dashboard", path: "/admin" }, { label: "Subscriptions" }]}
        title="Subscriptions"
        description="Manage subscription products and review user subscriptions and transactions."
      />
      <Tabs
        defaultActiveKey="products"
        items={[
          { key: "products", label: "Products", children: <ProductsTab /> },
          { key: "subscriptions", label: "Subscriptions", children: <SubscriptionsTab /> },
          { key: "transactions", label: "Transactions", children: <TransactionsTab /> },
        ]}
      />
    </PageContainer>
  );
}
