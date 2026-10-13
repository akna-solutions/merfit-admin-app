import React from "react";
import { Typography } from "antd";
import dayjs from "dayjs";
import { SectionCard, DataTable, EntityCell, StatusTag, RowActions } from "../../../components/admin";
import { DeleteOutlined } from "@ant-design/icons";
import { useListQuery } from "../../../utils/useListQuery";
import { notificationService } from "../services/notificationService";
import { useApiAction } from "../hooks/useApiAction";
import { NOTIFICATION_TYPE_LABELS, label } from "../utils/notificationLabels";
import NotificationsFilterBar from "./NotificationsFilterBar";
import { previewableImageUrl } from "../../../utils/imageUrl";

const { Text } = Typography;

export default function NotificationHistoryTab() {
  const run = useApiAction();
  const {
    rows, total, loading, filters, page, pageSize,
    setPage, setPageSize, updateFilters, resetFilters, refetch,
  } = useListQuery(
    notificationService.getNotifications,
    { search: "", isRead: undefined, type: undefined, dateRange: null },
  );
  
  const handleDelete = async (record) => {
    if (await run(() => notificationService.deleteNotification(record.id), "Bildirim silindi.")) refetch();
  };

  const columns = [
    {
      title: "Bildirim",
      key: "title",
      width: 280,
      render: (_, r) => <EntityCell avatar={previewableImageUrl(r.imageUrl)} avatarShape="square" title={r.title} subtitle={r.body} avatarColor="#2F6FED" />,
    },
    { title: "Kullanıcı", dataIndex: "userEmail", key: "userEmail", width: 200 },
    { title: "Tür", dataIndex: "type", key: "type", width: 170, render: (v) => label(NOTIFICATION_TYPE_LABELS, v) },
    {
      title: "Durum",
      dataIndex: "isRead",
      key: "isRead",
      width: 100,
      render: (v) => <StatusTag status={v ? "Read" : "Unread"} colorMap={{ read: "green", unread: "blue" }}>{v ? "Okundu" : "Okunmadı"}</StatusTag>,
    },
    {
      title: "Gönderilme Tarihi",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (v) => dayjs(v).format("DD MMM YYYY, HH:mm"),
    },
    {
      title: "Sona Erme Tarihi",
      dataIndex: "expiresAt",
      key: "expiresAt",
      width: 140,
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : <Text type="secondary">—</Text>),
    },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, record) => (
        <RowActions
          items={[
            {
              key: "delete",
              label: "Sil",
              icon: <DeleteOutlined />,
              danger: true,
              confirm: "Bu bildirim silinsin mi?",
              onClick: () => handleDelete(record),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="mbfit-page" style={{ gap: 20 }}>
      <NotificationsFilterBar filters={filters} onChange={updateFilters} onReset={resetFilters} />
      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={1150}
          emptyDescription="Uygulama içi bildirim kaydı yok."
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: (nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            },
          }}
        />
      </SectionCard>
    </div>
  );
}
