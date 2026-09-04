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
  if (record.isDeleted) return { label: "Silindi", color: "red", code: "deleted" };
  if (record.isActive) return { label: "Aktif", color: "green", code: "active" };
  return { label: "Pasif", color: "default", code: "inactive" };
}

const SUBSCRIPTION_LABEL = {
  active: { label: "Aktif", color: "gold" },
  expired: { label: "Süresi Doldu", color: "orange" },
  cancelled: { label: "İptal Edildi", color: "red" },
};

export function buildUsersColumns({ onView, onToggleStatus, onDelete, onRestore }) {
  return [
    {
      title: "Ad Soyad",
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
      title: "Kullanıcı Adı",
      dataIndex: "userName",
      key: "userName",
      width: 160,
      render: (value) => <Text type="secondary">@{value}</Text>,
    },
    {
      title: "Durum",
      key: "status",
      width: 120,
      filters: [
        { text: "Aktif", value: "active" },
        { text: "Pasif", value: "inactive" },
        { text: "Silindi", value: "deleted" },
      ],
      onFilter: (value, record) => {
        const status = deriveStatus(record).code;
        return status === value;
      },
      render: (_, record) => {
        const status = deriveStatus(record);
        return <Tag color={status.color}>{status.label}</Tag>;
      },
    },
    {
      title: "Abonelik",
      dataIndex: "subscriptionStatus",
      key: "subscriptionStatus",
      width: 140,
      render: (value) => {
        const meta = SUBSCRIPTION_LABEL[value];
        return <Tag color={meta?.color ?? "default"}>{meta?.label ?? "Yok"}</Tag>;
      },
    },
    {
      title: "Son Giriş",
      dataIndex: "lastLoginAt",
      key: "lastLoginAt",
      width: 150,
      sorter: (a, b) => new Date(a.lastLoginAt ?? 0) - new Date(b.lastLoginAt ?? 0),
      render: (value) => (value ? dayjs(value).format("DD MMM YYYY") : "—"),
    },
    {
      title: "Oluşturulma Tarihi",
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
            { key: "view", label: "Görüntüle", icon: <EyeOutlined />, onClick: () => onView(record) },
            ...(record.isDeleted
              ? [
                  {
                    key: "restore",
                    label: "Geri Yükle",
                    icon: <UndoOutlined />,
                    onClick: () => onRestore(record),
                  },
                ]
              : [
                  {
                    key: "toggle",
                    label: record.isActive ? "Pasifleştir" : "Aktifleştir",
                    icon: record.isActive ? <StopOutlined /> : <CheckCircleOutlined />,
                    onClick: () => onToggleStatus(record),
                  },
                  {
                    key: "delete",
                    label: "Sil",
                    icon: <DeleteOutlined />,
                    danger: true,
                    confirm: `${record.firstName} ${record.lastName} silinsin mi? Bu işlem hesabı kalıcı olarak silmez, yalnızca pasif duruma alır.`,
                    onClick: () => onDelete(record),
                  },
                ]),
          ]}
        />
      ),
    },
  ];
}
