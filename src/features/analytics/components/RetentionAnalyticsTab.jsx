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
      <Col xs={24} sm={12}><MetricCard title="7. Gün Elde Tutma" value={d.retention7DayPercent} suffix="%" precision={1} loading={loading} /></Col>
      <Col xs={24} sm={12}><MetricCard title="30. Gün Elde Tutma" value={d.retention30DayPercent} suffix="%" precision={1} loading={loading} /></Col>
    </Row>
  );
}
