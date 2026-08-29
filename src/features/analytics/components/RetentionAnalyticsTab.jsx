import React from "react";
import { Row, Col } from "antd";
import { MetricCard } from "../../../components/admin";
import { useAnalyticsSnapshot } from "../hooks/useAnalyticsSnapshot";
import { analyticsService } from "../services/analyticsService";

export default function RetentionAnalyticsTab() {
  const { data, loading } = useAnalyticsSnapshot(analyticsService.getRetention);
  const d = data ?? {};

  return (
    <Row gutter={[20, 20]}>
      <Col xs={24} sm={12}><MetricCard title="Day-7 Retention" value={d.retention7DayPercent} suffix="%" precision={1} loading={loading} /></Col>
      <Col xs={24} sm={12}><MetricCard title="Day-30 Retention" value={d.retention30DayPercent} suffix="%" precision={1} loading={loading} /></Col>
    </Row>
  );
}
