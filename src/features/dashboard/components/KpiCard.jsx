import React from "react";
import { Card, Statistic, Typography } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  CrownOutlined,
  DollarCircleOutlined,
  ThunderboltOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const ICONS = {
  users: TeamOutlined,
  active: UserSwitchOutlined,
  crown: CrownOutlined,
  revenue: DollarCircleOutlined,
  workout: ThunderboltOutlined,
  new: UserAddOutlined,
};

export default function KpiCard({ title, value, trend, trendLabel, icon }) {
  const Icon = ICONS[icon] ?? TeamOutlined;
  const isPositive = trend >= 0;

  return (
    <Card className="merfit-kpi-card" bordered={false}>
      <div className="merfit-kpi-card-top">
        <Text className="merfit-kpi-card-title">{title}</Text>
        <span className="merfit-kpi-card-icon">
          <Icon />
        </span>
      </div>
      <Statistic value={value} className="merfit-kpi-card-value" />
      <div
        className={`merfit-kpi-card-trend ${isPositive ? "is-positive" : "is-negative"}`}
      >
        {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        <span>{Math.abs(trend)}%</span>
        <Text type="secondary" className="merfit-kpi-card-trend-label">
          {trendLabel}
        </Text>
      </div>
    </Card>
  );
}
