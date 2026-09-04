import React, { useState } from "react";
import { Button, Tag, App } from "antd";
import { PlusOutlined, EditOutlined, StopOutlined, CheckCircleOutlined, DeleteOutlined, CloudUploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { PageHeader, PageContainer, SectionCard, DataTable, EntityCell, StatusTag, RowActions } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { contentService } from "../services/contentService";
import ContentFilterBar from "../components/ContentFilterBar";
import ContentFormDrawer from "../components/ContentFormDrawer";

// Kod değerleri API ile birebir eşleşir — yalnızca gösterilen etiketler Türkçeleştirilir.
const CONTENT_TYPE_LABELS = {
  Banner: "Banner",
  Announcement: "Duyuru",
  Campaign: "Kampanya",
  FeatureCard: "Özellik Kartı",
  Promotional: "Promosyon",
};

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
    message.success(`"${record.title ?? record.key}" artık ${!record.isActive ? "aktif" : "pasif"}.`);
    refetch();
  };

  const handlePublish = async (record) => {
    await contentService.publish(record.id);
    message.success(`"${record.title ?? record.key}" yayınlandı.`);
    refetch();
  };

  const handleDelete = async (record) => {
    await contentService.deleteContent(record.id);
    message.success(`"${record.title ?? record.key}" silindi.`);
    refetch();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (formState.item) {
        await contentService.updateContent(formState.item.id, values);
        message.success("İçerik güncellendi.");
      } else {
        await contentService.createContent(values);
        message.success("İçerik oluşturuldu.");
      }
      setFormState({ open: false, item: null });
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Başlık",
      key: "title",
      width: 260,
      render: (_, r) => <EntityCell title={r.title ?? r.key} subtitle={r.key} avatarColor="#2F6FED" />,
    },
    { title: "Tür", dataIndex: "type", key: "type", width: 130, render: (v) => <Tag>{CONTENT_TYPE_LABELS[v] ?? v}</Tag> },
    {
      title: "Durum",
      key: "status",
      width: 130,
      render: (_, r) => (
        <StatusTag status={r.isCurrentlyLive ? "Live" : r.isActive ? "Active" : "Inactive"} colorMap={{ live: "green" }}>
          {r.isCurrentlyLive ? "Yayında" : r.isActive ? "Aktif" : "Pasif"}
        </StatusTag>
      ),
    },
    {
      title: "Başlangıç",
      dataIndex: "startAt",
      key: "startAt",
      width: 130,
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : "—"),
    },
    {
      title: "Bitiş",
      dataIndex: "endAt",
      key: "endAt",
      width: 130,
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : "—"),
    },
    {
      title: "Güncellenme",
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
            { key: "publish", label: "Yayınla", icon: <CloudUploadOutlined />, onClick: () => handlePublish(record) },
            { key: "edit", label: "Düzenle", icon: <EditOutlined />, onClick: () => setFormState({ open: true, item: record }) },
            {
              key: "toggle",
              label: record.isActive ? "Pasifleştir" : "Aktifleştir",
              icon: record.isActive ? <StopOutlined /> : <CheckCircleOutlined />,
              onClick: () => handleToggleStatus(record),
            },
            {
              key: "delete",
              label: "Sil",
              icon: <DeleteOutlined />,
              danger: true,
              confirm: `"${record.title ?? record.key}" silinsin mi?`,
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
        crumbs={[{ label: "Panel", path: "/admin" }, { label: "İçerik" }]}
        title="İçerik"
        description="Banner, duyuru, kampanya ve özellik kartlarını yönetin."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, item: null })}>
            İçerik Oluştur
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
          emptyDescription="Bu filtrelerle eşleşen içerik bulunamadı."
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
