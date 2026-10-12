import React, { useState } from "react";
import { Button, Col, Input, Select, Typography } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { SectionCard, DataTable, StatusTag, RowActions, EntityCell, FilterBar } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { notificationTemplateService } from "../services/notificationService";
import { useApiAction } from "../hooks/useApiAction";
import { useNotificationMetadata } from "../hooks/useNotificationMetadata";
import { NOTIFICATION_TYPE_LABELS, label, toOptions } from "../utils/notificationLabels";
import TemplateFormDrawer from "./TemplateFormDrawer";

const { Text } = Typography;

export default function TemplatesTab() {
  const run = useApiAction();
  const { metadata } = useNotificationMetadata();
  const { rows, total, loading, filters, page, pageSize, setPage, setPageSize, updateFilters, resetFilters, refetch } =
    useListQuery(notificationTemplateService.getTemplates, { search: "", type: undefined, isActive: undefined });
  const [formState, setFormState] = useState({ open: false, template: null });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    const ok = formState.template
      ? await run(() => notificationTemplateService.updateTemplate(formState.template.id, values), "Şablon güncellendi.")
      : await run(() => notificationTemplateService.createTemplate(values), "Şablon oluşturuldu.");
    setSubmitting(false);
    if (ok) {
      setFormState({ open: false, template: null });
      refetch();
    }
  };

  const handleDelete = async (record) => {
    if (await run(() => notificationTemplateService.deleteTemplate(record.id), "Şablon silindi.")) refetch();
  };

  const columns = [
    { title: "Şablon", key: "name", width: 300, render: (_, r) => <EntityCell title={r.name} subtitle={r.titleTemplate} avatarColor="#0EA5E9" /> },
    { title: "Tür", dataIndex: "type", key: "type", width: 190, render: (v) => label(NOTIFICATION_TYPE_LABELS, v) },
    { title: "İçerik", dataIndex: "bodyTemplate", key: "bodyTemplate", width: 300, ellipsis: true },
    { title: "Kural", dataIndex: "ruleCount", key: "ruleCount", width: 80, render: (v) => v || <Text type="secondary">—</Text> },
    { title: "Durum", dataIndex: "isActive", key: "isActive", width: 100, render: (v) => <StatusTag status={v ? "Active" : "Inactive"}>{v ? "Aktif" : "Pasif"}</StatusTag> },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, r) => (
        <RowActions
          items={[
            { key: "edit", label: "Düzenle", icon: <EditOutlined />, onClick: () => setFormState({ open: true, template: r }) },
            { key: "delete", label: "Sil", icon: <DeleteOutlined />, danger: true, confirm: `"${r.name}" silinsin mi?`, onClick: () => handleDelete(r) },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="mbfit-page" style={{ gap: 16 }}>
      <FilterBar
        onReset={resetFilters}
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, template: null })}>Yeni Şablon</Button>}
      >
        <Col xs={24} sm={12} lg={8}>
          <Input allowClear prefix={<SearchOutlined />} placeholder="Ad veya başlıkta ara" value={filters.search} onChange={(e) => updateFilters({ search: e.target.value })} />
        </Col>
        <Col xs={12} sm={6} lg={5}>
          <Select allowClear style={{ width: "100%" }} placeholder="Tür" value={filters.type} onChange={(type) => updateFilters({ type })} options={toOptions(NOTIFICATION_TYPE_LABELS)} />
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Select
            allowClear
            style={{ width: "100%" }}
            placeholder="Durum"
            value={filters.isActive === undefined ? undefined : String(filters.isActive)}
            onChange={(v) => updateFilters({ isActive: v === undefined ? undefined : v === "true" })}
            options={[{ value: "true", label: "Aktif" }, { value: "false", label: "Pasif" }]}
          />
        </Col>
      </FilterBar>
      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={1100}
          emptyDescription="Henüz şablon yok."
          pagination={{ current: page, pageSize, total, onChange: (p, s) => { setPage(p); setPageSize(s); } }}
        />
      </SectionCard>
      <TemplateFormDrawer
        open={formState.open}
        template={formState.template}
        metadata={metadata}
        submitting={submitting}
        onClose={() => setFormState({ open: false, template: null })}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
