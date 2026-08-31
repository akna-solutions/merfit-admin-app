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
        crumbs={[{ label: "Dashboard", path: "/admin" }, { label: "Legal" }]}
        title="Legal"
        description="Manage legal documents (privacy policy, terms of service) and review user consents."
      />
      <Tabs
        defaultActiveKey="documents"
        items={[
          { key: "documents", label: "Documents", children: <DocumentsTab /> },
          { key: "consents", label: "User Consents", children: <ConsentsTab /> },
        ]}
      />
    </PageContainer>
  );
}
