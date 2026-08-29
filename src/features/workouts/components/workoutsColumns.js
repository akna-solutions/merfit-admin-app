import React from "react";
import { Tag, Typography } from "antd";
import dayjs from "dayjs";
import { EntityCell, StatusTag, RowActions } from "../../../components/admin";
import { EyeOutlined, EditOutlined, StopOutlined, CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

export function buildWorkoutsColumns({ onView, onEdit, onToggleStatus, onDelete }) {
  return [
    {
      title: "Workout",
      key: "title",
      fixed: "left",
      width: 260,
      render: (_, record) => (
        <EntityCell
          title={record.title}
          subtitle={record.categoryName}
          avatarColor="#2F6FED"
        />
      ),
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      key: "difficulty",
      width: 120,
      render: (v) => (
        <Tag color={v === "Beginner" ? "green" : v === "Intermediate" ? "blue" : "purple"}>{v}</Tag>
      ),
    },
    {
      title: "Duration",
      dataIndex: "durationMin",
      key: "durationMin",
      width: 100,
      sorter: (a, b) => a.durationMin - b.durationMin,
      render: (v) => `${v} min`,
    },
    {
      title: "Muscle Group",
      dataIndex: "muscleGroupName",
      key: "muscleGroupName",
      width: 130,
      render: (v) => v ?? <Text type="secondary">—</Text>,
    },
    {
      title: "Premium",
      dataIndex: "isPremium",
      key: "isPremium",
      width: 100,
      render: (v) => (v ? <Tag color="gold">Premium</Tag> : <Text type="secondary">—</Text>),
    },
    {
      title: "Featured",
      dataIndex: "isFeatured",
      key: "isFeatured",
      width: 100,
      render: (v) => (v ? <Tag color="blue">Featured</Tag> : <Text type="secondary">—</Text>),
    },
    {
      title: "AI Generated",
      dataIndex: "isAiGenerated",
      key: "isAiGenerated",
      width: 110,
      render: (v) => (v ? <Tag color="purple">AI</Tag> : <Text type="secondary">—</Text>),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 110,
      render: (v) => <StatusTag status={v ? "Active" : "Inactive"} />,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (v) => dayjs(v).format("DD MMM YYYY"),
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
              key: "toggle",
              label: record.isActive ? "Deactivate" : "Activate",
              icon: record.isActive ? <StopOutlined /> : <CheckCircleOutlined />,
              onClick: () => onToggleStatus(record),
            },
            {
              key: "delete",
              label: "Delete",
              icon: <DeleteOutlined />,
              danger: true,
              confirm: `Delete "${record.title}"? This cannot be undone.`,
              onClick: () => onDelete(record),
            },
          ]}
        />
      ),
    },
  ];
}
