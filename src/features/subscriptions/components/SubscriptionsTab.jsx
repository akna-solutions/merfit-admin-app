import React, { useState } from "react";
import dayjs from "dayjs";
import { SectionCard, DataTable, EntityCell, StatusTag } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { subscriptionService } from "../services/subscriptionsService";
import SubscriptionsFilterBar from "./SubscriptionsFilterBar";
import SubscriptionDetailDrawer from "./SubscriptionDetailDrawer";

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
      title: "User",
      key: "user",
      width: 220,
      render: (_, r) => <EntityCell title={r.userEmail} subtitle={`#${r.userId}`} avatarColor="#2F6FED" />,
    },
    { title: "Product", dataIndex: "productName", key: "productName", width: 200 },
    { title: "Provider", dataIndex: "provider", key: "provider", width: 100 },
    { title: "Status", dataIndex: "status", key: "status", width: 120, render: (v) => <StatusTag status={v} /> },
    { title: "Start Date", dataIndex: "startedAt", key: "startedAt", width: 130, render: (v) => dayjs(v).format("DD MMM YYYY") },
    {
      title: "Expiry",
      dataIndex: "expiresAt",
      key: "expiresAt",
      width: 130,
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : "—"),
    },
    { title: "Auto Renew", dataIndex: "autoRenew", key: "autoRenew", width: 110, render: (v) => (v ? "Yes" : "No") },
  ];

  return (
    <div className="merfit-page" style={{ gap: 20 }}>
      <SubscriptionsFilterBar filters={filters} onChange={updateFilters} onReset={resetFilters} />

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={1000}
          emptyDescription="No subscriptions match these filters."
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
