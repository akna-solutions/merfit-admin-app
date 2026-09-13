import React from "react";
import { Card, Statistic, Typography } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const { Text } = Typography;

// Generic KPI/stat card reused across feature pages (Nutrition Overview,
// Gamification, Notifications, AI, etc.) so every summary strip matches
// the Dashboard's KpiCard look exactly (spec §38).
export default function MetricCard({
  title,
  value,
  suffix,
  precision,
  icon,
  trend,
  trendLabel,
  loading,
}) {
  const hasTrend = typeof trend === "number";
  const isPositive = trend >= 0;

  return (
    <Card className="mbfit-kpi-card" bordered={false} loading={loading}>
      <div className="mbfit-kpi-card-top">
        <Text className="mbfit-kpi-card-title">{title}</Text>
        {icon && <span className="mbfit-kpi-card-icon">{icon}</span>}
      </div>
      <Statistic
        value={value}
        suffix={suffix}
        precision={precision}
        className="mbfit-kpi-card-value"
      />
      {hasTrend && (
        <div
          className={`mbfit-kpi-card-trend ${isPositive ? "is-positive" : "is-negative"}`}
        >
          {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          <span>{Math.abs(trend)}%</span>
          {trendLabel && (
            <Text type="secondary" className="mbfit-kpi-card-trend-label">
              {trendLabel}
            </Text>
          )}
        </div>
      )}
    </Card>
  );
}
