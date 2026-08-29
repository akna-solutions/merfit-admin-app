import React, { useState } from "react";
import { Button, Tag, App } from "antd";
import { PlusOutlined, EditOutlined, StopOutlined, CheckCircleOutlined, DeleteOutlined, CloudUploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { PageHeader, PageContainer, SectionCard, DataTable, EntityCell, StatusTag, RowActions } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { contentService } from "../services/contentService";
import ContentFilterBar from "../components/ContentFilterBar";
import ContentFormDrawer from "../components/ContentFormDrawer";

export default function ContentPage() {
  const { message } = App.useApp();
  const {
    rows, total, loading, filters, page, pageSize,
    setPage, setPageSize, updateFilters, resetFilters, refetch,
  } = useListQuery(
    contentService.getContent,
    { search: "", type: undefined, isActive: undefined },
  );
  const [formState, setFormState] = useState({ open: false, item: null });
  const [submitting, setSubmitting] = useState(false);

  const handleToggleStatus = async (record) => {
    await contentService.updateStatus(record.id, { isActive: !record.isActive });
    message.success(`"${record.title ?? record.key}" is now ${!record.isActive ? "active" : "inactive"}.`);
    refetch();
  };

  const handlePublish = async (record) => {
    await contentService.publish(record.id);
    message.success(`"${record.title ?? record.key}" published.`);
    refetch();
  };

  const handleDelete = async (record) => {
    await contentService.deleteContent(record.id);
    message.success(`"${record.title ?? record.key}" was deleted.`);
    refetch();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (formState.item) {
        await contentService.updateContent(formState.item.id, values);
        message.success("Content updated.");
      } else {
        await contentService.createContent(values);
        message.success("Content created.");
      }
      setFormState({ open: false, item: null });
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Title",
      key: "title",
      width: 260,
      render: (_, r) => <EntityCell title={r.title ?? r.key} subtitle={r.key} avatarColor="#2F6FED" />,
    },
    { title: "Type", dataIndex: "type", key: "type", width: 130, render: (v) => <Tag>{v}</Tag> },
    {
      title: "Status",
      key: "status",
      width: 130,
      render: (_, r) => <StatusTag status={r.isCurrentlyLive ? "Live" : r.isActive ? "Active" : "Inactive"} colorMap={{ live: "green" }} />,
    },
    {
      title: "Start At",
      dataIndex: "startAt",
      key: "startAt",
      width: 130,
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : "—"),
    },
    {
      title: "End At",
      dataIndex: "endAt",
      key: "endAt",
      width: 130,
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : "—"),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 140,
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : "—"),
    },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, record) => (
        <RowActions
          items={[
            { key: "publish", label: "Publish", icon: <CloudUploadOutlined />, onClick: () => handlePublish(record) },
            { key: "edit", label: "Edit", icon: <EditOutlined />, onClick: () => setFormState({ open: true, item: record }) },
            {
              key: "toggle",
              label: record.isActive ? "Deactivate" : "Activate",
              icon: record.isActive ? <StopOutlined /> : <CheckCircleOutlined />,
              onClick: () => handleToggleStatus(record),
            },
            {
              key: "delete",
              label: "Delete",
              icon: <DeleteOutlined />,
              danger: true,
              confirm: `Delete "${record.title ?? record.key}"?`,
              onClick: () => handleDelete(record),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: "Dashboard", path: "/admin" }, { label: "Content" }]}
        title="Content"
        description="Manage banners, announcements, campaigns and feature cards."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, item: null })}>
            Create Content
          </Button>
        }
      />

      <ContentFilterBar filters={filters} onChange={updateFilters} onReset={resetFilters} />

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={1100}
          emptyDescription="No content items match these filters."
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

      <ContentFormDrawer
        open={formState.open}
        item={formState.item}
        submitting={submitting}
        onClose={() => setFormState({ open: false, item: null })}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
