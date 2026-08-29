import React from "react";
import dayjs from "dayjs";
import { DetailDrawer, DataTable } from "../../../components/admin";

export default function AchievementUsersDrawer({ open, achievement, users, loading, onClose }) {
  const columns = [
    { title: "User", dataIndex: "userEmail", key: "userEmail" },
    { title: "Earned At", dataIndex: "earnedAt", key: "earnedAt", render: (v) => dayjs(v).format("DD MMM YYYY") },
  ];
  return (
    <DetailDrawer open={open} title={`Earned by — ${achievement?.title ?? ""}`} onClose={onClose}>
      <DataTable
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={false}
        scrollX={400}
        emptyDescription="No one has earned this achievement yet."
      />
    </DetailDrawer>
  );
}
