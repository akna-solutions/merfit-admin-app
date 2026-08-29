import React from "react";
import { Typography } from "antd";
import { EntityCell, RowActions } from "../../../components/admin";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

export function buildFoodsColumns({ onView, onEdit, onDelete }) {
  return [
    {
      title: "Food",
      key: "name",
      fixed: "left",
      width: 220,
      render: (_, record) => (
        <EntityCell title={record.name} subtitle={record.brand ?? "Generic"} avatarColor="#22C55E" />
      ),
    },
    {
      title: "Serving",
      key: "serving",
      width: 110,
      render: (_, record) => `${record.servingSize} ${record.servingUnit}`,
    },
    { title: "Calories", dataIndex: "calories", key: "calories", width: 100, sorter: (a, b) => a.calories - b.calories },
    { title: "Protein", dataIndex: "protein", key: "protein", width: 90, render: (v) => `${v} g` },
    { title: "Carbs", dataIndex: "carbs", key: "carbs", width: 90, render: (v) => `${v} g` },
    { title: "Fat", dataIndex: "fat", key: "fat", width: 80, render: (v) => `${v} g` },
    { title: "Fiber", dataIndex: "fiber", key: "fiber", width: 80, render: (v) => (v ? `${v} g` : "—") },
    {
      title: "Barcode",
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
            { key: "view", label: "View", icon: <EyeOutlined />, onClick: () => onView(record) },
            { key: "edit", label: "Edit", icon: <EditOutlined />, onClick: () => onEdit(record) },
            {
              key: "delete",
              label: "Delete",
              icon: <DeleteOutlined />,
              danger: true,
              confirm: `Delete "${record.name}"? This cannot be undone.`,
              onClick: () => onDelete(record),
            },
          ]}
        />
      ),
    },
  ];
}
