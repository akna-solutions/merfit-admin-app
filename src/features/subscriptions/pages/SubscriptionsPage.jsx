import React from "react";
import { Tabs } from "antd";
import { PageHeader, PageContainer } from "../../../components/admin";
import ProductsTab from "../components/ProductsTab";
import SubscriptionsTab from "../components/SubscriptionsTab";
import TransactionsTab from "../components/TransactionsTab";
import FeaturesTab from "../components/FeaturesTab";

export default function SubscriptionsPage() {
  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: "Panel", path: "/admin" }, { label: "Abonelikler" }]}
        title="Abonelikler"
        description="Abonelik ürünlerini yönetin, kullanıcı aboneliklerini ve işlemlerini inceleyin."
      />
      <Tabs
        defaultActiveKey="products"
        items={[
          { key: "products", label: "Ürünler", children: <ProductsTab /> },
          { key: "subscriptions", label: "Abonelikler", children: <SubscriptionsTab /> },
          { key: "transactions", label: "İşlemler", children: <TransactionsTab /> },
          { key: "features", label: "Özellikler", children: <FeaturesTab /> },
        ]}
      />
    </PageContainer>
  );
}
