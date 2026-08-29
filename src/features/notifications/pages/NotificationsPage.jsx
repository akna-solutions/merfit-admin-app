import React from "react";
import { Row, Col, Tabs } from "antd";
import { SendOutlined, CalendarOutlined, EyeOutlined } from "@ant-design/icons";
import { PageHeader, PageContainer, MetricCard } from "../../../components/admin";
import { useNotificationStats } from "../hooks/useNotificationStats";
import NotificationHistoryTab from "../components/NotificationHistoryTab";
import SendNotificationTab from "../components/SendNotificationTab";

export default function NotificationsPage() {
  const { loading, stats } = useNotificationStats();

  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: "Dashboard", path: "/admin" }, { label: "Notifications" }]}
        title="Notifications"
        description="Send push notifications and review notification history."
      />

      <Row gutter={[20, 20]}>
        <Col xs={24} sm={8}>
          <MetricCard title="Total Sent" value={stats.totalSent} icon={<SendOutlined />} loading={loading} />
        </Col>
        <Col xs={24} sm={8}>
          <MetricCard title="Sent Today" value={stats.sentToday} icon={<CalendarOutlined />} loading={loading} />
        </Col>
        <Col xs={24} sm={8}>
          <MetricCard title="Read Rate" value={stats.readRate} suffix="%" icon={<EyeOutlined />} loading={loading} />
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="history"
        items={[
          { key: "history", label: "History", children: <NotificationHistoryTab /> },
          { key: "send", label: "Send Notification", children: <SendNotificationTab /> },
        ]}
      />
    </PageContainer>
  );
}
