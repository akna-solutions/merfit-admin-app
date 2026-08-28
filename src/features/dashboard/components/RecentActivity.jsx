import React from "react";
import { Card, Table, Tag } from "antd";

const STATUS_COLOR = {
  Completed: "green",
  Active: "blue",
  Cancelled: "red",
};

const columns = [
  { title: "User", dataIndex: "user", key: "user" },
  { title: "Activity", dataIndex: "activity", key: "activity" },
  { title: "Date", dataIndex: "date", key: "date" },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (status) => (
      <Tag color={STATUS_COLOR[status] ?? "default"}>{status}</Tag>
    ),
  },
];

export default function RecentActivity({ data, loading }) {
  return (
    <Card
      title="Recent Activity"
      className="merfit-table-card"
      bordered={false}
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={false}
        scroll={{ x: 520 }}
        size="middle"
      />
    </Card>
  );
}
