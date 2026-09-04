import React from "react";
import { Tabs } from "antd";
import { PageHeader, PageContainer } from "../../../components/admin";
import LanguagesTab from "../components/LanguagesTab";
import TranslationGridTab from "../components/TranslationGridTab";

// AdminLanguageController had full create/update/delete support in
// languageService, but it was only ever used read-only (as a dropdown
// source) on this page. Restructured as tabs so languages can actually be
// managed, alongside the original side-by-side translations editor.
export default function TranslationsPage() {
  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: "Kontrol Paneli", path: "/admin" }, { label: "Çeviriler" }]}
        title="Çeviriler"
        description="Desteklenen dilleri yönetin ve çeviri metinlerini düzenleyin."
      />
      <Tabs
        defaultActiveKey="languages"
        items={[
          { key: "languages", label: "Diller", children: <LanguagesTab /> },
          { key: "translations", label: "Çeviriler", children: <TranslationGridTab /> },
        ]}
      />
    </PageContainer>
  );
}
