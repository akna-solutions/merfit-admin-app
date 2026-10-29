import React from "react";
import { Tabs } from "antd";
import { useSearchParams } from "react-router-dom";
import { PageContainer, PageHeader } from "../../../components/admin";
import { useStoreCategories } from "../hooks/useStoreCategories";
import CategoriesTab from "../components/CategoriesTab";
import OrdersTab from "../components/OrdersTab";
import ProductsTab from "../components/ProductsTab";
import StoreCampaignsTab from "../components/StoreCampaignsTab";

const TABS = ["orders", "products", "categories", "campaigns"];

export default function StorePage() {
  const [params, setParams] = useSearchParams();
  const active = TABS.includes(params.get("tab")) ? params.get("tab") : "orders";
  const { categories, reload } = useStoreCategories();

  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: "Panel", path: "/admin" }, { label: "MB Shop" }]}
        title="MB Shop"
        description="Mobil uygulamadaki mağazanın siparişlerini, ürünlerini, stoklarını, kategorilerini ve kampanyalarını yönetin."
      />
      <Tabs
        activeKey={active}
        onChange={(key) => setParams({ tab: key }, { replace: true })}
        destroyOnHidden
        items={[
          { key: "orders", label: "Siparişler", children: <OrdersTab /> },
          { key: "products", label: "Ürünler", children: <ProductsTab categories={categories} /> },
          { key: "categories", label: "Kategoriler", children: <CategoriesTab categories={categories} onCategoriesChanged={reload} /> },
          { key: "campaigns", label: "Kampanyalar", children: <StoreCampaignsTab /> },
        ]}
      />
    </PageContainer>
  );
}
