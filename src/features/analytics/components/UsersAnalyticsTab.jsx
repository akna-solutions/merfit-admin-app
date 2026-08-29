import React from "react";
import { Row, Col } from "antd";
import { TeamOutlined, UserSwitchOutlined, UserAddOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { MetricCard } from "../../../components/admin";
import { useAnalyticsSnapshot } from "../hooks/useAnalyticsSnapshot";
import { analyticsService } from "../services/analyticsService";

export default function UsersAnalyticsTab() {
  const { data, loading } = useAnalyticsSnapshot(analyticsService.getUsers);
  const d = data ?? {};

  return (
    <Row gutter={[20, 20]}>
      <Col xs={24} sm={12} lg={6}><MetricCard title="Total Users" value={d.totalUsers} icon={<TeamOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={12} lg={6}><MetricCard title="Active Users" value={d.activeUsers} icon={<UserSwitchOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={12} lg={6}><MetricCard title="New Users (7d)" value={d.newUsersLast7Days} icon={<UserAddOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={12} lg={6}><MetricCard title="New Users (30d)" value={d.newUsersLast30Days} icon={<UserAddOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={8}><MetricCard title="Daily Active Users" value={d.dau} icon={<ThunderboltOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={8}><MetricCard title="Weekly Active Users" value={d.wau} icon={<ThunderboltOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={8}><MetricCard title="Monthly Active Users" value={d.mau} icon={<ThunderboltOutlined />} loading={loading} /></Col>
    </Row>
  );
}
