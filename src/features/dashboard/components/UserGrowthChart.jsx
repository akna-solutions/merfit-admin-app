import React from "react";
import { Card } from "antd";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useThemeMode } from "../../../theme/ThemeContext";

export default function UserGrowthChart({ data, loading }) {
  const { mode } = useThemeMode();
  const gridColor = mode === "dark" ? "#2A3245" : "#EEF1F6";
  const axisColor = mode === "dark" ? "#93A0B4" : "#98A2B3";

  return (
    <Card
      title="User Growth"
      className="merfit-chart-card"
      bordered={false}
      loading={loading}
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={data}
          margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
        >
          <CartesianGrid stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="month"
            stroke={axisColor}
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <YAxis
            stroke={axisColor}
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "none",
              boxShadow: "0 4px 16px rgba(16,24,40,0.12)",
            }}
          />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#2F6FED"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
