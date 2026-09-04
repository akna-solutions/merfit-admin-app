import React from "react";
import { Typography } from "antd";
import { EntityCell, RowActions } from "../../../components/admin";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

export function buildFoodsColumns({ onView, onEdit, onDelete }) {
  return [
    {
      title: "Besin",
      key: "name",
      fixed: "left",
      width: 220,
      render: (_, record) => (
        <EntityCell title={record.name} subtitle={record.brand ?? "Jenerik"} avatarColor="#22C55E" />
      ),
    },
    {
      title: "Porsiyon",
      key: "serving",
      width: 110,
      render: (_, record) => `${record.servingSize} ${record.servingUnit}`,
    },
    { title: "Kalori", dataIndex: "calories", key: "calories", width: 100, sorter: (a, b) => a.calories - b.calories },
    { title: "Protein", dataIndex: "protein", key: "protein", width: 90, render: (v) => `${v} g` },
    { title: "Karbonhidrat", dataIndex: "carbs", key: "carbs", width: 90, render: (v) => `${v} g` },
    { title: "Yağ", dataIndex: "fat", key: "fat", width: 80, render: (v) => `${v} g` },
    { title: "Lif", dataIndex: "fiber", key: "fiber", width: 80, render: (v) => (v ? `${v} g` : "—") },
    {
      title: "Barkod",
      dataIndex: "barcode",
      key: "barcode",
      width: 150,
      render: (v) => v ?? <Text type="secondary">—</Text>,
    },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, record) => (
        <RowActions
          items={[
            { key: "view", label: "Görüntüle", icon: <EyeOutlined />, onClick: () => onView(record) },
            { key: "edit", label: "Düzenle", icon: <EditOutlined />, onClick: () => onEdit(record) },
            {
              key: "delete",
              label: "Sil",
              icon: <DeleteOutlined />,
              danger: true,
              confirm: `"${record.name}" silinsin mi? Bu işlem geri alınamaz.`,
              onClick: () => onDelete(record),
            },
          ]}
        />
      ),
    },
  ];
}
