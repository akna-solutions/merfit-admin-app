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
      <Col xs={24} sm={12} lg={6}><MetricCard title="Toplam Kullanıcı" value={d.totalUsers} icon={<TeamOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={12} lg={6}><MetricCard title="Aktif Kullanıcı" value={d.activeUsers} icon={<UserSwitchOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={12} lg={6}><MetricCard title="Yeni Kullanıcı (7g)" value={d.newUsersLast7Days} icon={<UserAddOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={12} lg={6}><MetricCard title="Yeni Kullanıcı (30g)" value={d.newUsersLast30Days} icon={<UserAddOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={8}><MetricCard title="Günlük Aktif Kullanıcı" value={d.dau} icon={<ThunderboltOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={8}><MetricCard title="Haftalık Aktif Kullanıcı" value={d.wau} icon={<ThunderboltOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={8}><MetricCard title="Aylık Aktif Kullanıcı" value={d.mau} icon={<ThunderboltOutlined />} loading={loading} /></Col>
    </Row>
  );
}
