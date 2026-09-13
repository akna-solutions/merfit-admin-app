import React, { useState } from "react";
import { Button, App } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, UnorderedListOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { SectionCard, DataTable, StatusTag, RowActions } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { leaderboardService, LEADERBOARD_PERIOD_TYPE_LABELS } from "../services/gamificationService";
import LeaderboardPeriodFormDrawer from "./LeaderboardPeriodFormDrawer";
import LeaderboardEntriesDrawer from "./LeaderboardEntriesDrawer";

export default function LeaderboardTab() {
  const { message } = App.useApp();
  const {
    rows, total, loading, page, pageSize, setPage, setPageSize, refetch,
  } = useListQuery(leaderboardService.getPeriods, { type: undefined, isActive: undefined });

  const [formState, setFormState] = useState({ open: false, period: null });
  const [submitting, setSubmitting] = useState(false);
  const [entriesState, setEntriesState] = useState({ open: false, period: null, entries: [], loading: false });

  const handleDelete = async (record) => {
    await leaderboardService.deletePeriod(record.id);
    message.success("Liderlik tablosu dönemi silindi.");
    refetch();
  };

  const loadEntries = async (period) => {
    setEntriesState({ open: true, period, entries: [], loading: true });
    const res = await leaderboardService.getEntries(period.id);
    setEntriesState({ open: true, period, entries: res.data.items, loading: false });
  };

  const handleRecalculate = async (periodId) => {
    await leaderboardService.recalculate(periodId);
    const res = await leaderboardService.getEntries(periodId);
    setEntriesState((prev) => ({ ...prev, entries: res.data.items }));
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (formState.period) {
        await leaderboardService.updatePeriod(formState.period.id, values);
        message.success("Dönem güncellendi.");
      } else {
        await leaderboardService.createPeriod(values);
        message.success("Dönem oluşturuldu.");
      }
      setFormState({ open: false, period: null });
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { title: "Tür", dataIndex: "type", key: "type", width: 120, render: (v) => LEADERBOARD_PERIOD_TYPE_LABELS[v] ?? v },
    { title: "Başlangıç Tarihi", dataIndex: "startDate", key: "startDate", width: 140, render: (v) => dayjs(v).format("DD MMM YYYY") },
    { title: "Bitiş Tarihi", dataIndex: "endDate", key: "endDate", width: 140, render: (v) => dayjs(v).format("DD MMM YYYY") },
    { title: "Aktif", dataIndex: "isActive", key: "isActive", width: 100, render: (v) => <StatusTag status={v ? "Active" : "Inactive"}>{v ? "Aktif" : "Pasif"}</StatusTag> },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, record) => (
        <RowActions
          items={[
            { key: "entries", label: "Kayıtları Görüntüle", icon: <UnorderedListOutlined />, onClick: () => loadEntries(record) },
            { key: "edit", label: "Düzenle", icon: <EditOutlined />, onClick: () => setFormState({ open: true, period: record }) },
            {
              key: "delete",
              label: "Sil",
              icon: <DeleteOutlined />,
              danger: true,
              confirm: "Bu liderlik tablosu dönemi silinsin mi?",
              onClick: () => handleDelete(record),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="mbfit-page" style={{ gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, period: null })}>
          Dönem Oluştur
        </Button>
      </div>

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={700}
          emptyDescription="Henüz liderlik tablosu dönemi yok."
          onRow={(record) => ({ className: "mbfit-row-clickable", onClick: () => loadEntries(record) })}
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

      <LeaderboardPeriodFormDrawer
        open={formState.open}
        period={formState.period}
        submitting={submitting}
        onClose={() => setFormState({ open: false, period: null })}
        onSubmit={handleSubmit}
      />

      <LeaderboardEntriesDrawer
        open={entriesState.open}
        period={entriesState.period}
        entries={entriesState.entries}
        loading={entriesState.loading}
        onClose={() => setEntriesState({ open: false, period: null, entries: [], loading: false })}
        onRecalculate={handleRecalculate}
      />
    </div>
  );
}
