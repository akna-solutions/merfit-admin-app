import React from "react";
import { Row, Col, Card } from "antd";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { CheckCircleOutlined, ThunderboltOutlined, PercentageOutlined, FireOutlined } from "@ant-design/icons";
import { MetricCard } from "../../../components/admin";
import { useAnalyticsSnapshot } from "../hooks/useAnalyticsSnapshot";
import { analyticsService } from "../services/analyticsService";
import { useThemeMode } from "../../../theme/ThemeContext";

export default function WorkoutsAnalyticsTab() {
  const { data, loading } = useAnalyticsSnapshot(analyticsService.getWorkouts);
  const { mode } = useThemeMode();
  const d = data ?? {};
  const gridColor = mode === "dark" ? "#2A3245" : "#EEF1F6";
  const axisColor = mode === "dark" ? "#93A0B4" : "#98A2B3";

  return (
    <div className="merfit-page" style={{ gap: 20 }}>
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} lg={6}><MetricCard title="Seans (30g)" value={d.totalSessionsLast30Days} icon={<ThunderboltOutlined />} loading={loading} /></Col>
        <Col xs={24} sm={12} lg={6}><MetricCard title="Tamamlanan (30g)" value={d.completedSessionsLast30Days} icon={<CheckCircleOutlined />} loading={loading} /></Col>
        <Col xs={24} sm={12} lg={6}><MetricCard title="Tamamlanma Oranı" value={d.workoutCompletionRatePercent} suffix="%" precision={1} icon={<PercentageOutlined />} loading={loading} /></Col>
        <Col xs={24} sm={12} lg={6}><MetricCard title="Ort. / Aktif Kullanıcı" value={d.averageWorkoutsPerActiveUser} precision={1} icon={<FireOutlined />} loading={loading} /></Col>
      </Row>
      <Card title="En Popüler Antrenmanlar" bordered={false} className="merfit-chart-card" loading={loading}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={d.topWorkouts ?? []} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid stroke={gridColor} vertical={false} />
            <XAxis dataKey="name" stroke={axisColor} tickLine={false} axisLine={false} fontSize={12} />
            <YAxis stroke={axisColor} tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 16px rgba(16,24,40,0.12)" }} />
            <Bar dataKey="count" fill="#2F6FED" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
