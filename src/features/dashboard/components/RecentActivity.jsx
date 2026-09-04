import React from "react";
import { Card, Table, Tag } from "antd";

const STATUS_COLOR = {
  Tamamlandı: "green",
  Aktif: "blue",
  "İptal Edildi": "red",
};

const columns = [
  { title: "Kullanıcı", dataIndex: "user", key: "user" },
  { title: "Etkinlik", dataIndex: "activity", key: "activity" },
  { title: "Tarih", dataIndex: "date", key: "date" },
  {
    title: "Durum",
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
      title="Son Etkinlikler"
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
