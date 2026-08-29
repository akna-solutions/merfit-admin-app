import React from "react";
import { Typography, App } from "antd";
import dayjs from "dayjs";
import { SectionCard, DataTable, EntityCell, StatusTag, RowActions } from "../../../components/admin";
import { DeleteOutlined } from "@ant-design/icons";
import { useListQuery } from "../../../utils/useListQuery";
import { notificationService } from "../services/notificationService";
import NotificationsFilterBar from "./NotificationsFilterBar";

const { Text } = Typography;

export default function NotificationHistoryTab() {
  const { message } = App.useApp();
  const {
    rows, total, loading, filters, page, pageSize,
    setPage, setPageSize, updateFilters, resetFilters, refetch,
  } = useListQuery(
    notificationService.getNotifications,
    { search: "", isRead: undefined, dateRange: null },
  );
  
  const handleDelete = async (record) => {
    await notificationService.deleteNotification(record.id);
    message.success("Notification deleted.");
    refetch();
  };

  const columns = [
    {
      title: "Notification",
      key: "title",
      width: 280,
      render: (_, r) => <EntityCell title={r.title} subtitle={r.body} avatarColor="#2F6FED" />,
    },
    { title: "User", dataIndex: "userEmail", key: "userEmail", width: 200 },
    {
      title: "Status",
      dataIndex: "isRead",
      key: "isRead",
      width: 100,
      render: (v) => <StatusTag status={v ? "Read" : "Unread"} colorMap={{ read: "green", unread: "blue" }} />,
    },
    {
      title: "Sent At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (v) => dayjs(v).format("DD MMM YYYY, HH:mm"),
    },
    {
      title: "Expires At",
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
              label: "Delete",
              icon: <DeleteOutlined />,
              danger: true,
              confirm: "Delete this notification?",
              onClick: () => handleDelete(record),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="merfit-page" style={{ gap: 20 }}>
      <NotificationsFilterBar filters={filters} onChange={updateFilters} onReset={resetFilters} />
      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={1000}
          emptyDescription="No notifications sent yet."
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
