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
        crumbs={[{ label: "Kontrol Paneli", path: "/admin" }, { label: "Bildirimler" }]}
        title="Bildirimler"
        description="Push bildirimleri gönderin ve bildirim geçmişini inceleyin."
      />

      <Row gutter={[20, 20]}>
        <Col xs={24} sm={8}>
          <MetricCard title="Toplam Gönderilen" value={stats.totalSent} icon={<SendOutlined />} loading={loading} />
        </Col>
        <Col xs={24} sm={8}>
          <MetricCard title="Bugün Gönderilen" value={stats.sentToday} icon={<CalendarOutlined />} loading={loading} />
        </Col>
        <Col xs={24} sm={8}>
          <MetricCard title="Okunma Oranı" value={stats.readRate} suffix="%" icon={<EyeOutlined />} loading={loading} />
        </Col>
      </Row>

      <Tabs
        defaultActiveKey="history"
        items={[
          { key: "history", label: "Geçmiş", children: <NotificationHistoryTab /> },
          { key: "send", label: "Bildirim Gönder", children: <SendNotificationTab /> },
        ]}
      />
    </PageContainer>
  );
}
