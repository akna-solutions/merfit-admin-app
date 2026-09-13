import React, { useState } from "react";
import dayjs from "dayjs";
import { SectionCard, DataTable, EntityCell } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { transactionService } from "../services/subscriptionsService";
import TransactionsFilterBar from "./TransactionsFilterBar";
import TransactionDetailDrawer from "./TransactionDetailDrawer";

export default function TransactionsTab() {
  const {
    rows, total, loading, filters, page, pageSize,
    setPage, setPageSize, updateFilters, resetFilters,
  } = useListQuery(
    transactionService.getTransactions,
    { search: "", provider: undefined, dateRange: null },
  );
  const [detailState, setDetailState] = useState({ open: false, transaction: null, loading: false });

  const handleView = async (record) => {
    setDetailState({ open: true, transaction: null, loading: true });
    const detail = await transactionService.getTransactionById(record.id);
    setDetailState({ open: true, transaction: detail.data, loading: false });
  };

  const columns = [
    {
      title: "Kullanıcı",
      key: "user",
      width: 220,
      render: (_, r) => <EntityCell title={r.userEmail} subtitle={r.transactionId} avatarColor="#7C3AED" />,
    },
    { title: "Ürün", dataIndex: "productId", key: "productId", width: 160 },
    { title: "Sağlayıcı", dataIndex: "provider", key: "provider", width: 100 },
    {
      title: "Tutar",
      key: "amount",
      width: 120,
      sorter: (a, b) => a.amount - b.amount,
      render: (_, r) => `${r.amount.toFixed(2)} ${r.currency}`,
    },
    { title: "Satın Alma Tarihi", dataIndex: "purchasedAt", key: "purchasedAt", width: 140, render: (v) => dayjs(v).format("DD MMM YYYY") },
    {
      title: "Bitiş",
      dataIndex: "expiresAt",
      key: "expiresAt",
      width: 130,
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : "—"),
    },
  ];

  return (
    <div className="mbfit-page" style={{ gap: 20 }}>
      <TransactionsFilterBar filters={filters} onChange={updateFilters} onReset={resetFilters} />

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={950}
          emptyDescription="Bu filtrelere uyan işlem yok."
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

      <TransactionDetailDrawer
        open={detailState.open}
        transaction={detailState.transaction}
        loading={detailState.loading}
        onClose={() => setDetailState({ open: false, transaction: null, loading: false })}
      />
    </div>
  );
}
