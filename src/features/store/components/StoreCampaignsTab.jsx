import React, { useState } from "react";
import { App, Button, Col, Input, Select } from "antd";
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, StopOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { DataTable, EntityCell, FilterBar, RowActions, SectionCard, StatusTag } from "../../../components/admin";
import { previewableImageUrl } from "../../../utils/imageUrl";
import { useApiAction } from "../../notifications/hooks/useApiAction";
import { useSafeListQuery } from "../hooks/useSafeListQuery";
import { storeCampaignService } from "../services/storeService";
import { STORE_CAMPAIGN_STATUS_COLORS, STORE_CAMPAIGN_STATUS_LABELS } from "../utils/storeLabels";
import ListError from "./ListError";
import StoreCampaignFormDrawer from "./StoreCampaignFormDrawer";

const DEFAULT_FILTERS = { search: "", isActive: undefined };
const formatDate = (v) => (v ? dayjs(v).format("DD MMM YYYY") : "—");

export default function StoreCampaignsTab() {
  const { message } = App.useApp();
  const run = useApiAction();
  const { rows, total, loading, error, filters, page, pageSize, setPage, setPageSize, updateFilters, resetFilters, refetch } = useSafeListQuery(
    storeCampaignService.getCampaigns,
    DEFAULT_FILTERS,
    50,
  );
  const [formState, setFormState] = useState({ open: false, item: null });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    const item = formState.item;
    const result = await run(
      () => (item ? storeCampaignService.updateCampaign(item.id, payload) : storeCampaignService.createCampaign(payload)),
      item ? "Kampanya güncellendi." : "Kampanya oluşturuldu.",
    );
    setSubmitting(false);
    if (result) {
      setFormState({ open: false, item: null });
      refetch();
    }
  };

  const handleToggle = async (record) => {
    const result = await run(() => storeCampaignService.updateStatus(record.id, { isActive: !record.isActive }));
    if (result) {
      message.success(`"${record.title}" ${record.isActive ? "pasife alındı" : "aktifleştirildi"}.`);
      refetch();
    }
  };

  const handleDelete = async (record) => {
    const result = await run(() => storeCampaignService.deleteCampaign(record.id), `"${record.title}" silindi.`);
    if (result) refetch();
  };

  const columns = [
    {
      title: "Kampanya",
      key: "title",
      width: 300,
      render: (_, r) => (
        <EntityCell avatar={previewableImageUrl(r.imageUrl)} avatarShape="square" title={r.title} subtitle={r.description || "Açıklama yok"} avatarColor={r.tint || "#2F6FED"} />
      ),
    },
    {
      title: "Durum",
      dataIndex: "status",
      width: 120,
      render: (v) => (
        <StatusTag status={v} colorMap={STORE_CAMPAIGN_STATUS_COLORS}>
          {STORE_CAMPAIGN_STATUS_LABELS[v] ?? v}
        </StatusTag>
      ),
    },
    { title: "Ürün", key: "products", width: 80, render: (_, r) => r.productIds.length },
    { title: "Başlangıç", dataIndex: "startAt", width: 120, render: formatDate },
    { title: "Bitiş", dataIndex: "endAt", width: 120, render: formatDate },
    { title: "Sıra", dataIndex: "sortOrder", width: 70 },
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
              label: record.isActive ? "Pasife al" : "Aktifleştir",
              icon: record.isActive ? <StopOutlined /> : <CheckCircleOutlined />,
              onClick: () => handleToggle(record),
            },
            { key: "delete", label: "Sil", icon: <DeleteOutlined />, danger: true, confirm: `"${record.title}" silinsin mi?`, onClick: () => handleDelete(record) },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <FilterBar
        onReset={resetFilters}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, item: null })}>
            Kampanya Oluştur
          </Button>
        }
      >
        <Col xs={24} sm={12} lg={8}>
          <Input allowClear placeholder="Kampanya ara" prefix={<SearchOutlined />} value={filters.search} onChange={(e) => updateFilters({ search: e.target.value })} />
        </Col>
        <Col xs={24} sm={12} lg={5}>
          <Select
            style={{ width: "100%" }}
            value={filters.isActive === undefined ? "all" : String(filters.isActive)}
            onChange={(v) => updateFilters({ isActive: v === "all" ? undefined : v === "true" })}
            options={[
              { value: "all", label: "Tüm durumlar" },
              { value: "true", label: "Aktif" },
              { value: "false", label: "Pasif" },
            ]}
            aria-label="Durum"
          />
        </Col>
      </FilterBar>

      <SectionCard>
        <ListError error={error} onRetry={refetch} />
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={900}
          emptyDescription={error ? "Liste yüklenemedi." : "Henüz mağaza kampanyası yok."}
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

      <StoreCampaignFormDrawer
        open={formState.open}
        item={formState.item}
        submitting={submitting}
        onClose={() => setFormState({ open: false, item: null })}
        onSubmit={handleSubmit}
      />
    </>
  );
}
