import React from "react";
import { Tabs } from "antd";
import { PageHeader, PageContainer } from "../../../components/admin";
import DocumentsTab from "../components/DocumentsTab";
import ConsentsTab from "../components/ConsentsTab";

// MerfitApi.Api/Controllers/Admin/AdminLegalController.cs had no admin
// screen at all: legal documents (Privacy Policy / Terms of Service)
// couldn't be created, edited or published, and user consent records
// couldn't be reviewed.
export default function LegalPage() {
  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: "Kontrol Paneli", path: "/admin" }, { label: "Hukuki" }]}
        title="Hukuki"
        description="Hukuki belgeleri (gizlilik politikası, kullanım şartları) yönetin ve kullanıcı onaylarını inceleyin."
      />
      <Tabs
        defaultActiveKey="documents"
        items={[
          { key: "documents", label: "Belgeler", children: <DocumentsTab /> },
          { key: "consents", label: "Kullanıcı Onayları", children: <ConsentsTab /> },
        ]}
      />
    </PageContainer>
  );
}
