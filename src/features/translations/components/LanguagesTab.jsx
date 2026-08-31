import React, { useState } from "react";
import { Button, Tag, App } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { SectionCard, DataTable, EntityCell, StatusTag, RowActions } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { languageService } from "../services/translationService";
import LanguageFormDrawer from "./LanguageFormDrawer";

// MerfitApi.Api/Controllers/Admin/AdminLanguageController.cs — languageService
// already had full CRUD, but it was only ever called read-only to populate
// the Translations grid's language pickers. This tab lets admins actually
// add/edit/remove languages and set the default.
export default function LanguagesTab() {
  const { message } = App.useApp();
  const {
    rows, total, loading, page, pageSize, setPage, setPageSize, refetch,
  } = useListQuery(languageService.getLanguages, {}, 50);

  const [formState, setFormState] = useState({ open: false, language: null });
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async (record) => {
    await languageService.deleteLanguage(record.id);
    message.success(`"${record.name}" was deleted.`);
    refetch();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (formState.language) {
        await languageService.updateLanguage(formState.language.id, values);
        message.success("Language updated.");
      } else {
        await languageService.createLanguage(values);
        message.success("Language created.");
      }
      setFormState({ open: false, language: null });
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Language",
      key: "name",
      width: 220,
      render: (_, r) => <EntityCell title={r.name} subtitle={r.code} avatarColor="#2F6FED" />,
    },
    {
      title: "Default",
      dataIndex: "isDefault",
      key: "isDefault",
      width: 100,
      render: (v) => (v ? <Tag color="gold">Default</Tag> : null),
    },
    {
      title: "Translation Count",
      dataIndex: "translationCount",
      key: "translationCount",
      width: 150,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 110,
      render: (v) => <StatusTag status={v ? "Active" : "Inactive"} />,
    },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, record) => (
        <RowActions
          items={[
            { key: "edit", label: "Edit", icon: <EditOutlined />, onClick: () => setFormState({ open: true, language: record }) },
            {
              key: "delete",
              label: "Delete",
              icon: <DeleteOutlined />,
              danger: true,
              confirm: `Delete "${record.name}"? Its translations will also be removed.`,
              onClick: () => handleDelete(record),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="merfit-page" style={{ gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, language: null })}>
          Add Language
        </Button>
      </div>

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={700}
          emptyDescription="No languages yet."
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: (nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            },
          }}
        />
      </SectionCard>

      <LanguageFormDrawer
        open={formState.open}
        language={formState.language}
        submitting={submitting}
        onClose={() => setFormState({ open: false, language: null })}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
