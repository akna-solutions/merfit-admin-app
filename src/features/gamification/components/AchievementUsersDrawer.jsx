import React from "react";
import dayjs from "dayjs";
import { DetailDrawer, DataTable } from "../../../components/admin";

export default function AchievementUsersDrawer({ open, achievement, users, loading, onClose }) {
  const columns = [
    { title: "Kullanıcı", dataIndex: "userEmail", key: "userEmail" },
    { title: "Kazanılma Tarihi", dataIndex: "earnedAt", key: "earnedAt", render: (v) => dayjs(v).format("DD MMM YYYY") },
  ];
  return (
    <DetailDrawer open={open} title={`${achievement?.title ?? ""} — Kazananlar`} onClose={onClose}>
      <DataTable
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={false}
        scrollX={400}
        emptyDescription="Bu başarıyı henüz kimse kazanmadı."
      />
    </DetailDrawer>
  );
}
