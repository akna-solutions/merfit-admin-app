import React from "react";
import { Button, App } from "antd";
import { ReloadOutlined, TrophyOutlined } from "@ant-design/icons";
import { DetailDrawer, DataTable, EntityCell } from "../../../components/admin";

export default function LeaderboardEntriesDrawer({ open, period, entries, loading, onClose, onRecalculate }) {
  const { message } = App.useApp();

  const handleRecalculate = async () => {
    await onRecalculate(period.id);
    message.success("Leaderboard recalculated.");
  };

  const columns = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      width: 70,
      render: (v) => (v <= 3 ? <TrophyOutlined style={{ color: ["#F5A623", "#98A2B3", "#B87333"][v - 1] }} /> : v),
    },
    {
      title: "User",
      key: "user",
      render: (_, r) => <EntityCell title={r.userEmail} subtitle={`#${r.userId}`} avatarColor="#2F6FED" />,
    },
    { title: "Points", dataIndex: "points", key: "points", width: 100 },
    { title: "Workouts", dataIndex: "workoutCount", key: "workoutCount", width: 100 },
  ];

  return (
    <DetailDrawer
      open={open}
      title={`${period?.type ?? ""} Leaderboard`}
      width={520}
      onClose={onClose}
      extra={
        <Button size="small" icon={<ReloadOutlined />} onClick={handleRecalculate}>
          Recalculate
        </Button>
      }
    >
      <DataTable
        columns={columns}
        dataSource={entries}
        loading={loading}
        pagination={false}
        scrollX={420}
        emptyDescription="No entries for this period yet."
      />
    </DetailDrawer>
  );
}
