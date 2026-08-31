import React, { useState } from "react";
import { Button, Col, Select, Tag, Typography, App } from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, CloudUploadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { SectionCard, DataTable, EntityCell, StatusTag, RowActions, FilterBar } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { documentService, LEGAL_DOCUMENT_TYPE } from "../services/legalService";
import DocumentFormDrawer from "./DocumentFormDrawer";
import DocumentDetailDrawer from "./DocumentDetailDrawer";

const { Text } = Typography;

export default function DocumentsTab() {
  const { message } = App.useApp();
  const {
    rows, total, loading, filters, page, pageSize,
    setPage, setPageSize, updateFilters, resetFilters, refetch,
  } = useListQuery(documentService.getDocuments, { type: undefined, language: undefined, isActive: undefined });

  const [formState, setFormState] = useState({ open: false, document: null });
  const [submitting, setSubmitting] = useState(false);
  const [detailState, setDetailState] = useState({ open: false, document: null, loading: false });

  const handleView = async (record) => {
    setDetailState({ open: true, document: null, loading: true });
    const detail = await documentService.getDocumentById(record.id);
    setDetailState({ open: true, document: detail.data, loading: false });
  };

  const handleDelete = async (record) => {
    await documentService.deleteDocument(record.id);
    message.success(`"${record.title}" was deleted.`);
    refetch();
  };

  const handlePublish = async (record) => {
    await documentService.publish(record.id);
    message.success(`"${record.title}" published. Other ${record.type} documents for ${record.language} were deactivated.`);
    refetch();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (formState.document) {
        await documentService.updateDocument(formState.document.id, values);
        message.success("Document updated.");
      } else {
        await documentService.createDocument(values);
        message.success("Document created.");
      }
      setFormState({ open: false, document: null });
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Document",
      key: "title",
      fixed: "left",
      width: 240,
      render: (_, r) => <EntityCell title={r.title} subtitle={`v${r.version}`} avatarColor="#2F6FED" />,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 140,
      render: (v) => <Tag color={v === "PrivacyPolicy" ? "blue" : "purple"}>{v}</Tag>,
    },
    { title: "Language", dataIndex: "language", key: "language", width: 100 },
    {
      title: "Published At",
      dataIndex: "publishedAt",
      key: "publishedAt",
      width: 140,
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : <Text type="secondary">—</Text>),
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
            { key: "view", label: "View", icon: <EyeOutlined />, onClick: () => handleView(record) },
            { key: "edit", label: "Edit", icon: <EditOutlined />, onClick: () => setFormState({ open: true, document: record }) },
            {
              key: "publish",
              label: "Publish",
              icon: <CloudUploadOutlined />,
              confirm: `Publish "${record.title}"? Other ${record.type} documents in ${record.language} will be deactivated.`,
              onClick: () => handlePublish(record),
            },
            {
              key: "delete",
              label: "Delete",
              icon: <DeleteOutlined />,
              danger: true,
              confirm: `Delete "${record.title}"? This cannot be undone.`,
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
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, document: null })}>
          Create Document
        </Button>
      </div>

      <FilterBar onReset={resetFilters}>
        <Col xs={12} sm={8} lg={6}>
          <Select
            style={{ width: "100%" }}
            placeholder="Type"
            allowClear
            value={filters.type}
            onChange={(v) => updateFilters({ type: v })}
            options={LEGAL_DOCUMENT_TYPE.map((t) => ({ value: t, label: t }))}
          />
        </Col>
        <Col xs={12} sm={8} lg={5}>
          <Select
            style={{ width: "100%" }}
            placeholder="Status"
            allowClear
            value={filters.isActive}
            onChange={(v) => updateFilters({ isActive: v })}
            options={[{ value: true, label: "Active" }, { value: false, label: "Inactive" }]}
          />
        </Col>
      </FilterBar>

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={900}
          emptyDescription="No legal documents yet."
          onRow={(record) => ({ className: "merfit-row-clickable", onClick: () => handleView(record) })}
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

      <DocumentFormDrawer
        open={formState.open}
        document={formState.document}
        submitting={submitting}
        onClose={() => setFormState({ open: false, document: null })}
        onSubmit={handleSubmit}
      />

      <DocumentDetailDrawer
        open={detailState.open}
        document={detailState.document}
        loading={detailState.loading}
        onClose={() => setDetailState({ open: false, document: null, loading: false })}
      />
    </div>
  );
}
