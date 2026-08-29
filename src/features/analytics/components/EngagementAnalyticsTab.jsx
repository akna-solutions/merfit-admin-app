import React from "react";
import { Row, Col } from "antd";
import { ThunderboltOutlined, PercentageOutlined } from "@ant-design/icons";
import { MetricCard } from "../../../components/admin";
import { useAnalyticsSnapshot } from "../hooks/useAnalyticsSnapshot";
import { analyticsService } from "../services/analyticsService";

export default function EngagementAnalyticsTab() {
  const { data, loading } = useAnalyticsSnapshot(analyticsService.getEngagement);
  const d = data ?? {};

  return (
    <Row gutter={[20, 20]}>
      <Col xs={24} sm={8}><MetricCard title="Daily Active Users" value={d.dau} icon={<ThunderboltOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={8}><MetricCard title="Weekly Active Users" value={d.wau} icon={<ThunderboltOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={8}><MetricCard title="Monthly Active Users" value={d.mau} icon={<ThunderboltOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={12}><MetricCard title="Stickiness (DAU/MAU)" value={d.stickinessPercent} suffix="%" precision={1} icon={<PercentageOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={12}><MetricCard title="Avg Sessions / Active User (30d)" value={d.averageSessionsPerActiveUserLast30Days} precision={1} loading={loading} /></Col>
    </Row>
  );
}
