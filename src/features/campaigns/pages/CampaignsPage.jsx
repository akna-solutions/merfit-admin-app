import React, { useState } from "react";
import { Button, Space, Tag, Tooltip, App } from "antd";
import {
  PlusOutlined, EditOutlined, StopOutlined, CheckCircleOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { PageHeader, PageContainer, SectionCard, DataTable, EntityCell, StatusTag, RowActions } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { previewableImageUrl } from "../../../utils/imageUrl";
import { campaignService } from "../services/campaignService";
import CampaignFilterBar from "../components/CampaignFilterBar";
import CampaignFormDrawer from "../components/CampaignFormDrawer";
import { CAMPAIGN_STATUS_COLORS, CAMPAIGN_STATUS_LABELS, buildReorder } from "../utils/campaignForm";

const DEFAULT_FILTERS = { search: "", status: undefined };
const PAGE_SIZE = 50;

export default function CampaignsPage() {
  const { message } = App.useApp();
  const {
    rows, total, loading, filters, page, pageSize,
    setPage, setPageSize, updateFilters, resetFilters, refetch,
  } = useListQuery(campaignService.getCampaigns, DEFAULT_FILTERS, PAGE_SIZE);
  const [formState, setFormState] = useState({ open: false, item: null });
  const [submitting, setSubmitting] = useState(false);
  const [reordering, setReordering] = useState(false);

  // Taşıma tüm listeyi yeniden numaralar; bu yüzden yalnızca filtresiz ve tek sayfalık listede açıktır.
  const canReorder = !filters.search && !filters.status && total <= pageSize && page === 1;

  const handleToggleStatus = async (record) => {
    await campaignService.updateStatus(record.id, { isActive: !record.isActive });
    message.success(`"${record.title}" ${!record.isActive ? "aktifleştirildi" : "pasife alındı"}.`);
    refetch();
  };

  const handleDelete = async (record) => {
    await campaignService.deleteCampaign(record.id);
    message.success(`"${record.title}" silindi.`);
    refetch();
  };

  const handleMove = async (index, direction) => {
    const items = buildReorder(rows, index, direction);
    if (!items) return;
    setReordering(true);
    try {
      await campaignService.reorder(items);
      refetch();
    } finally {
      setReordering(false);
    }
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    try {
      if (formState.item) {
        await campaignService.updateCampaign(formState.item.id, payload);
        message.success("Kampanya güncellendi.");
      } else {
        await campaignService.createCampaign(payload);
        message.success("Kampanya oluşturuldu.");
      }
      setFormState({ open: false, item: null });
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (v) => (v ? dayjs(v).format("DD MMM YYYY") : "—");

  const columns = [
    {
      title: "Sıra",
      key: "order",
      width: 110,
      render: (_, r, index) => (
        <Space size={4}>
          <Tooltip title={canReorder ? "Yukarı taşı" : "Sıralamak için filtreleri temizleyin"}>
            <Button
              size="small"
              icon={<ArrowUpOutlined />}
              aria-label="Yukarı taşı"
              disabled={!canReorder || reordering || index === 0}
              onClick={() => handleMove(index, -1)}
            />
          </Tooltip>
          <Tooltip title={canReorder ? "Aşağı taşı" : "Sıralamak için filtreleri temizleyin"}>
            <Button
              size="small"
              icon={<ArrowDownOutlined />}
              aria-label="Aşağı taşı"
              disabled={!canReorder || reordering || index === rows.length - 1}
              onClick={() => handleMove(index, 1)}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: "Kampanya",
      key: "title",
      width: 300,
      render: (_, r) => (
        <EntityCell
          avatar={previewableImageUrl(r.imageUrl)}
          avatarShape="square"
          title={r.title}
          subtitle={r.summary || "Kısa açıklama yok"}
          avatarColor="#2F6FED"
        />
      ),
    },
    { title: "Kategori", dataIndex: "category", key: "category", width: 130, render: (v) => (v ? <Tag>{v}</Tag> : "—") },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (v) => (
        <StatusTag status={v} colorMap={CAMPAIGN_STATUS_COLORS}>
          {CAMPAIGN_STATUS_LABELS[v] ?? v}
        </StatusTag>
      ),
    },
    { title: "Başlangıç", dataIndex: "startAt", key: "startAt", width: 120, render: formatDate },
    { title: "Bitiş", dataIndex: "endAt", key: "endAt", width: 120, render: formatDate },
    { title: "Sıra no", dataIndex: "sortOrder", key: "sortOrder", width: 90 },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, record) => (
        <RowActions
          items={[
            { key: "edit", label: "Düzenle", icon: <EditOutlined />, onClick: () => setFormState({ open: true, item: record }) },
            {
              key: "toggle",
              label: record.isActive ? "Pasife al (arşivle)" : "Aktifleştir",
              icon: record.isActive ? <StopOutlined /> : <CheckCircleOutlined />,
              onClick: () => handleToggleStatus(record),
            },
            {
              key: "delete",
              label: "Sil",
              icon: <DeleteOutlined />,
              danger: true,
              confirm: `"${record.title}" kalıcı olarak silinsin mi? Yalnızca gizlemek için pasife alın.`,
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
        crumbs={[{ label: "Panel", path: "/admin" }, { label: "Kampanyalar" }]}
        title="Kampanyalar"
        description="Mobil uygulamanın ana sayfasındaki kampanya kartlarını yönetin."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, item: null })}>
            Kampanya Oluştur
          </Button>
        }
      />

      <CampaignFilterBar filters={filters} onChange={updateFilters} onReset={resetFilters} />

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading || reordering}
          scrollX={1100}
          emptyDescription="Henüz kampanya yok veya filtrelerle eşleşen kampanya bulunamadı."
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

      <CampaignFormDrawer
        open={formState.open}
        item={formState.item}
        submitting={submitting}
        onClose={() => setFormState({ open: false, item: null })}
        onSubmit={handleSubmit}
      />
    </PageContainer>
  );
}
