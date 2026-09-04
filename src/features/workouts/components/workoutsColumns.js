import React from "react";
import { Tag, Typography } from "antd";
import dayjs from "dayjs";
import { EntityCell, StatusTag, RowActions } from "../../../components/admin";
import { EyeOutlined, EditOutlined, StopOutlined, CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { difficultyLabel } from "../data/enumLabels";

const { Text } = Typography;

export function buildWorkoutsColumns({ onView, onEdit, onToggleStatus, onDelete }) {
  return [
    {
      title: "Antrenman",
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
      title: "Zorluk",
      dataIndex: "difficulty",
      key: "difficulty",
      width: 120,
      render: (v) => (
        <Tag color={v === "Beginner" ? "green" : v === "Intermediate" ? "blue" : "purple"}>{difficultyLabel(v)}</Tag>
      ),
    },
    {
      title: "Süre",
      dataIndex: "durationMin",
      key: "durationMin",
      width: 100,
      sorter: (a, b) => a.durationMin - b.durationMin,
      render: (v) => `${v} dk`,
    },
    {
      title: "Kas Grubu",
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
      title: "Öne Çıkan",
      dataIndex: "isFeatured",
      key: "isFeatured",
      width: 100,
      render: (v) => (v ? <Tag color="blue">Öne Çıkan</Tag> : <Text type="secondary">—</Text>),
    },
    {
      title: "Yapay Zeka ile Oluşturuldu",
      dataIndex: "isAiGenerated",
      key: "isAiGenerated",
      width: 110,
      render: (v) => (v ? <Tag color="purple">YZ</Tag> : <Text type="secondary">—</Text>),
    },
    {
      title: "Durum",
      dataIndex: "isActive",
      key: "isActive",
      width: 110,
      render: (v) => <StatusTag status={v ? "Active" : "Inactive"}>{v ? "Aktif" : "Pasif"}</StatusTag>,
    },
    {
      title: "Oluşturulma Tarihi",
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
            { key: "view", label: "Görüntüle", icon: <EyeOutlined />, onClick: () => onView(record) },
            { key: "edit", label: "Düzenle", icon: <EditOutlined />, onClick: () => onEdit(record) },
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
              confirm: `"${record.title}" silinsin mi? Bu işlem geri alınamaz.`,
              onClick: () => onDelete(record),
            },
          ]}
        />
      ),
    },
  ];
}
