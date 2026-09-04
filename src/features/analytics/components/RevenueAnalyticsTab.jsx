import React from "react";
import { Row, Col } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";
import { MetricCard } from "../../../components/admin";
import { useAnalyticsSnapshot } from "../hooks/useAnalyticsSnapshot";
import { analyticsService } from "../services/analyticsService";

function money(value) {
  if (value === undefined) return undefined;
  return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function RevenueAnalyticsTab() {
  const { data, loading } = useAnalyticsSnapshot(analyticsService.getRevenue);
  const d = data ?? {};

  return (
    <Row gutter={[20, 20]}>
      <Col xs={24} sm={12} lg={6}><MetricCard title="Toplam Gelir" value={money(d.totalRevenue)} suffix="TRY" icon={<DollarCircleOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={12} lg={6}><MetricCard title="Gelir (7g)" value={money(d.revenueLast7Days)} suffix="TRY" icon={<DollarCircleOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={12} lg={6}><MetricCard title="Gelir (30g)" value={money(d.revenueLast30Days)} suffix="TRY" icon={<DollarCircleOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={12} lg={6}><MetricCard title="Ort. Gelir / Ödeme Yapan Kullanıcı" value={money(d.averageRevenuePerPayingUser)} suffix="TRY" icon={<DollarCircleOutlined />} loading={loading} /></Col>
    </Row>
  );
}
