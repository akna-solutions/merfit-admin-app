import React from "react";
import { Card } from "antd";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useThemeMode } from "../../../theme/ThemeContext";

export default function WorkoutActivityChart({ data, loading }) {
  const { mode } = useThemeMode();
  const gridColor = mode === "dark" ? "#2A3245" : "#EEF1F6";
  const axisColor = mode === "dark" ? "#93A0B4" : "#98A2B3";

  return (
    <Card
      title="Antrenman Etkinliği"
      className="mbfit-chart-card"
      bordered={false}
      loading={loading}
    >
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
        >
          <defs>
            <linearGradient id="workoutFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2F6FED" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#2F6FED" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="day"
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
          <Area
            type="monotone"
            dataKey="workouts"
            stroke="#2F6FED"
            strokeWidth={2.5}
            fill="url(#workoutFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
