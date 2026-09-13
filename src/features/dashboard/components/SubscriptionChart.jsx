import React from "react";
import { Card, Space, Typography } from "antd";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const { Text } = Typography;

const COLORS = ["#2F6FED", "#F5A623", "#22C55E"];

export default function SubscriptionChart({ data, loading }) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <Card
      title="Abonelik Dağılımı"
      className="mbfit-chart-card"
      bordered={false}
      loading={loading}
    >
      <div className="mbfit-donut-wrap">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "none",
                boxShadow: "0 4px 16px rgba(16,24,40,0.12)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <Space direction="vertical" size={6} className="mbfit-donut-legend">
          {data.map((slice, index) => (
            <div key={slice.name} className="mbfit-donut-legend-row">
              <span
                className="mbfit-donut-legend-dot"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <Text className="mbfit-donut-legend-label">{slice.name}</Text>
              <Text type="secondary" className="mbfit-donut-legend-pct">
                {total ? Math.round((slice.value / total) * 100) : 0}%
              </Text>
            </div>
          ))}
        </Space>
      </div>
    </Card>
  );
}
