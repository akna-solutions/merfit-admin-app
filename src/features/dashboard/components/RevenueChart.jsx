import React from "react";
import { Card } from "antd";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useThemeMode } from "../../../theme/ThemeContext";

export default function RevenueChart({ data, loading }) {
  const { mode } = useThemeMode();
  const gridColor = mode === "dark" ? "#2A3245" : "#EEF1F6";
  const axisColor = mode === "dark" ? "#93A0B4" : "#98A2B3";

  return (
    <Card
      title="Gelir"
      className="merfit-chart-card"
      bordered={false}
      loading={loading}
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
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
            cursor={{
              fill:
                mode === "dark"
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(16,24,40,0.03)",
            }}
            contentStyle={{
              borderRadius: 8,
              border: "none",
              boxShadow: "0 4px 16px rgba(16,24,40,0.12)",
            }}
          />
          <Bar
            dataKey="revenue"
            fill="#2F6FED"
            radius={[6, 6, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
