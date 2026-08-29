import React from "react";
import { Row, Col } from "antd";
import { AppleOutlined, FireOutlined, AimOutlined } from "@ant-design/icons";
import { MetricCard } from "../../../components/admin";
import { useAnalyticsSnapshot } from "../hooks/useAnalyticsSnapshot";
import { analyticsService } from "../services/analyticsService";

export default function NutritionAnalyticsTab() {
  const { data, loading } = useAnalyticsSnapshot(analyticsService.getNutrition);
  const d = data ?? {};

  return (
    <Row gutter={[20, 20]}>
      <Col xs={24} sm={12} lg={6}><MetricCard title="Meals Logged (30d)" value={d.totalMealsLast30Days} icon={<AppleOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={12} lg={6}><MetricCard title="Avg Meals / User" value={d.averageMealsPerUserLast30Days} precision={1} icon={<AppleOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={12} lg={6}><MetricCard title="Avg Calories / Meal" value={d.averageCaloriesPerMeal} icon={<FireOutlined />} loading={loading} /></Col>
      <Col xs={24} sm={12} lg={6}><MetricCard title="Users With Goal Set" value={d.usersWithNutritionGoal} icon={<AimOutlined />} loading={loading} /></Col>
    </Row>
  );
}
