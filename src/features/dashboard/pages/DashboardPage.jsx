import React from 'react';
import { Row, Col } from 'antd';
import { useDashboardData } from '../hooks/useDashboardData';
import KpiCard from '../components/KpiCard';
import UserGrowthChart from '../components/UserGrowthChart';
import RevenueChart from '../components/RevenueChart';
import SubscriptionChart from '../components/SubscriptionChart';
import WorkoutActivityChart from '../components/WorkoutActivityChart';
import RecentActivity from '../components/RecentActivity';
import QuickStats from '../components/QuickStats';

const CARD_GAP = [20, 20];

export default function DashboardPage() {
  const {
    kpiMetrics,
    userGrowth,
    revenue,
    subscriptions,
    workoutActivity,
    recentActivity,
    quickStats,
    loading,
  } = useDashboardData();

  return (
    <div className="mbfit-dashboard">
      {/* KPI row */}
      <Row gutter={CARD_GAP} className="mbfit-dashboard-row">
        {(loading ? Array.from({ length: 6 }) : kpiMetrics).map((metric, index) => (
          <Col key={metric?.id ?? index} xs={24} sm={12} lg={8} xl={4}>
            {metric ? (
              <KpiCard {...metric} />
            ) : (
              <div className="mbfit-kpi-card mbfit-kpi-card-skeleton" />
            )}
          </Col>
        ))}
      </Row>

      {/* User growth + subscription distribution */}
      <Row gutter={CARD_GAP} className="mbfit-dashboard-row">
        <Col xs={24} xl={16}>
          <UserGrowthChart data={userGrowth} loading={loading} />
        </Col>
        <Col xs={24} xl={8}>
          <SubscriptionChart data={subscriptions} loading={loading} />
        </Col>
      </Row>

      {/* Revenue + workout activity */}
      <Row gutter={CARD_GAP} className="mbfit-dashboard-row">
        <Col xs={24} xl={16}>
          <RevenueChart data={revenue} loading={loading} />
        </Col>
        <Col xs={24} xl={8}>
          <WorkoutActivityChart data={workoutActivity} loading={loading} />
        </Col>
      </Row>

      {/* Recent activity + quick stats */}
      <Row gutter={CARD_GAP} className="mbfit-dashboard-row">
        <Col xs={24} xl={16}>
          <RecentActivity data={recentActivity} loading={loading} />
        </Col>
        <Col xs={24} xl={8}>
          <QuickStats data={quickStats} loading={loading} />
        </Col>
      </Row>
    </div>
  );
}