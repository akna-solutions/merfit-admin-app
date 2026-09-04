import React, { useState } from "react";
import { Tag } from "antd";
import dayjs from "dayjs";
import { SectionCard, DataTable, EntityCell, StatusTag } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { aiService } from "../services/aiService";
import RequestsFilterBar from "./RequestsFilterBar";
import RequestDetailDrawer from "./RequestDetailDrawer";

// Display-only labels for the underlying request type/status values (values
// used for filtering and matching stay in English — only the rendered text
// is translated here).
const TYPE_LABELS = { Workout: "Antrenman", Nutrition: "Beslenme", Insight: "İçgörü" };
const STATUS_LABELS = { Pending: "Beklemede", Processing: "İşleniyor", Completed: "Tamamlandı", Failed: "Başarısız" };

export default function RequestsTab() {
  const {
    rows, total, loading, filters, page, pageSize,
    setPage, setPageSize, updateFilters, resetFilters,
  } = useListQuery(
    aiService.getRequests,
    { search: "", type: undefined, status: undefined, dateRange: null },
  );
  const [detailState, setDetailState] = useState({ open: false, request: null, loading: false });

  const handleView = async (record) => {
    setDetailState({ open: true, request: null, loading: true });
    const detail = await aiService.getRequestById(record.id);
    setDetailState({ open: true, request: detail.data, loading: false });
  };

  const columns = [
    {
      title: "Kullanıcı",
      key: "user",
      width: 220,
      render: (_, r) => <EntityCell title={r.userEmail} subtitle={`#${r.userId}`} avatarColor="#7C3AED" />,
    },
    { title: "Tür", dataIndex: "type", key: "type", width: 110, render: (v) => <Tag>{TYPE_LABELS[v] ?? v}</Tag> },
    { title: "Model", dataIndex: "model", key: "model", width: 150 },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (v) => <StatusTag status={v}>{STATUS_LABELS[v] ?? v}</StatusTag>,
    },
    {
      title: "Oluşturulma Tarihi",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (v) => dayjs(v).format("DD MMM YYYY, HH:mm"),
    },
    {
      title: "Başlangıç Tarihi",
      dataIndex: "startedAt",
      key: "startedAt",
      width: 150,
      render: (v) => (v ? dayjs(v).format("DD MMM, HH:mm") : "—"),
    },
    {
      title: "Süre",
      key: "duration",
      width: 100,
      render: (_, r) =>
        r.startedAt && r.completedAt
          ? `${Math.round((new Date(r.completedAt) - new Date(r.startedAt)) / 1000)}s`
          : "—",
    },
  ];

  return (
    <div className="merfit-page" style={{ gap: 20 }}>
      <RequestsFilterBar filters={filters} onChange={updateFilters} onReset={resetFilters} />
      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={1050}
          emptyDescription="Bu filtrelerle eşleşen yapay zeka isteği bulunamadı."
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

      <RequestDetailDrawer
        open={detailState.open}
        request={detailState.request}
        loading={detailState.loading}
        onClose={() => setDetailState({ open: false, request: null, loading: false })}
      />
    </div>
  );
}
