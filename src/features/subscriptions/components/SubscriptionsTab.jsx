import React, { useState } from "react";
import dayjs from "dayjs";
import { SectionCard, DataTable, EntityCell, StatusTag } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { subscriptionService } from "../services/subscriptionsService";
import SubscriptionsFilterBar from "./SubscriptionsFilterBar";
import SubscriptionDetailDrawer from "./SubscriptionDetailDrawer";

const STATUS_LABELS = {
  Active: "Aktif",
  Expired: "Süresi Doldu",
  Cancelled: "İptal Edildi",
  Refunded: "İade Edildi",
  Paused: "Duraklatıldı",
  GracePeriod: "Ek Süre",
};

export default function SubscriptionsTab() {
  const {
    rows, total, loading, filters, page, pageSize,
    setPage, setPageSize, updateFilters, resetFilters, refetch,
  } = useListQuery(
    subscriptionService.getSubscriptions,
    { search: "", status: undefined, provider: undefined, dateRange: null },
  );
  const [detailState, setDetailState] = useState({ open: false, subscription: null, loading: false });

  const handleView = async (record) => {
    setDetailState({ open: true, subscription: null, loading: true });
    const detail = await subscriptionService.getSubscriptionById(record.id);
    setDetailState({ open: true, subscription: detail.data, loading: false });
  };

  const columns = [
    {
      title: "Kullanıcı",
      key: "user",
      width: 220,
      render: (_, r) => <EntityCell title={r.userEmail} subtitle={`#${r.userId}`} avatarColor="#2F6FED" />,
    },
    { title: "Ürün", dataIndex: "productName", key: "productName", width: 200 },
    { title: "Sağlayıcı", dataIndex: "provider", key: "provider", width: 100 },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (v) => <StatusTag status={v}>{STATUS_LABELS[v] ?? v}</StatusTag>,
    },
    { title: "Başlangıç Tarihi", dataIndex: "startedAt", key: "startedAt", width: 130, render: (v) => dayjs(v).format("DD MMM YYYY") },
    {
      title: "Bitiş",
      dataIndex: "expiresAt",
      key: "expiresAt",
      width: 130,
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : "—"),
    },
    { title: "Otomatik Yenileme", dataIndex: "autoRenew", key: "autoRenew", width: 110, render: (v) => (v ? "Evet" : "Hayır") },
  ];

  return (
    <div className="mbfit-page" style={{ gap: 20 }}>
      <SubscriptionsFilterBar filters={filters} onChange={updateFilters} onReset={resetFilters} />

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={1000}
          emptyDescription="Bu filtrelere uyan abonelik yok."
          onRow={(record) => ({ className: "mbfit-row-clickable", onClick: () => handleView(record) })}
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

      <SubscriptionDetailDrawer
        open={detailState.open}
        subscription={detailState.subscription}
        loading={detailState.loading}
        onClose={() => setDetailState({ open: false, subscription: null, loading: false })}
        onChanged={() => {
          setDetailState({ open: false, subscription: null, loading: false });
          refetch();
        }}
      />
    </div>
  );
}
