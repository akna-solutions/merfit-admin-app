import React from "react";
import { Button, App } from "antd";
import { ReloadOutlined, TrophyOutlined } from "@ant-design/icons";
import { DetailDrawer, DataTable, EntityCell } from "../../../components/admin";
import { LEADERBOARD_PERIOD_TYPE_LABELS } from "../services/gamificationService";

export default function LeaderboardEntriesDrawer({ open, period, entries, loading, onClose, onRecalculate }) {
  const { message } = App.useApp();

  const handleRecalculate = async () => {
    await onRecalculate(period.id);
    message.success("Liderlik tablosu yeniden hesaplandı.");
  };

  const columns = [
    {
      title: "Sıra",
      dataIndex: "rank",
      key: "rank",
      width: 70,
      render: (v) => (v <= 3 ? <TrophyOutlined style={{ color: ["#F5A623", "#98A2B3", "#B87333"][v - 1] }} /> : v),
    },
    {
      title: "Kullanıcı",
      key: "user",
      render: (_, r) => <EntityCell title={r.userEmail} subtitle={`#${r.userId}`} avatarColor="#2F6FED" />,
    },
    { title: "Puan", dataIndex: "points", key: "points", width: 100 },
    { title: "Antrenman", dataIndex: "workoutCount", key: "workoutCount", width: 100 },
  ];

  return (
    <DetailDrawer
      open={open}
      title={`${LEADERBOARD_PERIOD_TYPE_LABELS[period?.type] ?? period?.type ?? ""} Liderlik Tablosu`}
      width={520}
      onClose={onClose}
      extra={
        <Button size="small" icon={<ReloadOutlined />} onClick={handleRecalculate}>
          Yeniden Hesapla
        </Button>
      }
    >
      <DataTable
        columns={columns}
        dataSource={entries}
        loading={loading}
        pagination={false}
        scrollX={420}
        emptyDescription="Bu dönem için henüz kayıt yok."
      />
    </DetailDrawer>
  );
}
