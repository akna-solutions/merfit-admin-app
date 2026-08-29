import React, { useState } from "react";
import { Button, App } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, UnorderedListOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { SectionCard, DataTable, StatusTag, RowActions } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { leaderboardService } from "../services/gamificationService";
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
    message.success("Leaderboard period deleted.");
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
        message.success("Period updated.");
      } else {
        await leaderboardService.createPeriod(values);
        message.success("Period created.");
      }
      setFormState({ open: false, period: null });
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { title: "Type", dataIndex: "type", key: "type", width: 120 },
    { title: "Start Date", dataIndex: "startDate", key: "startDate", width: 140, render: (v) => dayjs(v).format("DD MMM YYYY") },
    { title: "End Date", dataIndex: "endDate", key: "endDate", width: 140, render: (v) => dayjs(v).format("DD MMM YYYY") },
    { title: "Active", dataIndex: "isActive", key: "isActive", width: 100, render: (v) => <StatusTag status={v ? "Active" : "Inactive"} /> },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, record) => (
        <RowActions
          items={[
            { key: "entries", label: "View Entries", icon: <UnorderedListOutlined />, onClick: () => loadEntries(record) },
            { key: "edit", label: "Edit", icon: <EditOutlined />, onClick: () => setFormState({ open: true, period: record }) },
            {
              key: "delete",
              label: "Delete",
              icon: <DeleteOutlined />,
              danger: true,
              confirm: "Delete this leaderboard period?",
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
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, period: null })}>
          Create Period
        </Button>
      </div>

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={700}
          emptyDescription="No leaderboard periods yet."
          onRow={(record) => ({ className: "merfit-row-clickable", onClick: () => loadEntries(record) })}
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
