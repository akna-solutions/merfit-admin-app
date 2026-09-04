import React from "react";
import { Row, Col } from "antd";
import { CreditCardOutlined, CrownOutlined, PercentageOutlined, FallOutlined } from "@ant-design/icons";
import { MetricCard } from "../../../components/admin";
import { useAnalyticsSnapshot } from "../hooks/useAnalyticsSnapshot";
import { analyticsService } from "../services/analyticsService";

export default function SubscriptionsAnalyticsTab() {
  const { data, loading } = useAnalyticsSnapshot(analyticsService.getSubscriptions);
  const d = data ?? {};

  return (
    <Row gutter={[20, 20]}>
      <Col xs={24} sm={12} lg={6}><MetricCard title="Toplam Abonelik" value={d.totalSubscriptions} icon={<CreditCardOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={12} lg={6}><MetricCard title="Aktif Abonelik" value={d.activeSubscriptions} icon={<CrownOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={12} lg={6}><MetricCard title="Plus Dönüşüm Oranı" value={d.plusConversionRatePercent} suffix="%" precision={1} icon={<PercentageOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={12} lg={6}><MetricCard title="Kayıp Oranı" value={d.churnRatePercent} suffix="%" precision={1} icon={<FallOutlined />} loading={loading} /></Col>
    </Row>
  );
}
