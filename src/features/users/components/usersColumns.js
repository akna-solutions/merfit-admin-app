import React from "react";
import { Tag, Typography } from "antd";
import dayjs from "dayjs";
import { EntityCell, RowActions } from "../../../components/admin";
import {
  EyeOutlined,
  StopOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  UndoOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

// AdminUserController only exposes status toggle (PATCH .../status),
// soft-delete (DELETE), and restore (PATCH .../restore) — there is no
// create/update-profile endpoint, so row actions are limited to what the
// real API can actually do (see MerfitApi AdminUserController.cs).
function deriveStatus(record) {
  if (record.isDeleted) return { label: "Deleted", color: "red" };
  if (record.isActive) return { label: "Active", color: "green" };
  return { label: "Inactive", color: "default" };
}

const SUBSCRIPTION_LABEL = {
  active: { label: "Active", color: "gold" },
  expired: { label: "Expired", color: "orange" },
  cancelled: { label: "Cancelled", color: "red" },
};

export function buildUsersColumns({ onView, onToggleStatus, onDelete, onRestore }) {
  return [
    {
      title: "Name",
      key: "name",
      fixed: "left",
      width: 240,
      render: (_, record) => (
        <EntityCell
          title={`${record.firstName} ${record.lastName}`}
          subtitle={record.email}
          avatarColor={record.avatarColor}
        />
      ),
    },
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
      width: 160,
      render: (value) => <Text type="secondary">@{value}</Text>,
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      filters: [
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" },
        { text: "Deleted", value: "deleted" },
      ],
      onFilter: (value, record) => {
        const status = deriveStatus(record).label.toLowerCase();
        return status === value;
      },
      render: (_, record) => {
        const status = deriveStatus(record);
        return <Tag color={status.color}>{status.label}</Tag>;
      },
    },
    {
      title: "Subscription",
      dataIndex: "subscriptionStatus",
      key: "subscriptionStatus",
      width: 140,
      render: (value) => {
        const meta = SUBSCRIPTION_LABEL[value];
        return <Tag color={meta?.color ?? "default"}>{meta?.label ?? "None"}</Tag>;
      },
    },
    {
      title: "Last Login",
      dataIndex: "lastLoginAt",
      key: "lastLoginAt",
      width: 150,
      sorter: (a, b) => new Date(a.lastLoginAt ?? 0) - new Date(b.lastLoginAt ?? 0),
      render: (value) => (value ? dayjs(value).format("DD MMM YYYY") : "—"),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (value) => dayjs(value).format("DD MMM YYYY"),
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
            ...(record.isDeleted
              ? [
                  {
                    key: "restore",
                    label: "Restore",
                    icon: <UndoOutlined />,
                    onClick: () => onRestore(record),
                  },
                ]
              : [
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
                    confirm: `Delete ${record.firstName} ${record.lastName}? This soft-deletes the account.`,
                    onClick: () => onDelete(record),
                  },
                ]),
          ]}
        />
      ),
    },
  ];
}
