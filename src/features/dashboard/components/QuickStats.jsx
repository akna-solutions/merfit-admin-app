import React from "react";
import { Card, Statistic, Progress, Space } from "antd";

export default function QuickStats({ data, loading }) {
  return (
    <Card
      title="Quick Stats"
      className="merfit-quickstats-card"
      bordered={false}
      loading={loading}
    >
      <Space direction="vertical" size={18} style={{ width: "100%" }}>
        {data.map((stat) => (
          <div key={stat.id} className="merfit-quickstat-row">
            <Statistic title={stat.label} value={stat.value} />
            {typeof stat.progress === "number" && (
              <Progress
                percent={stat.progress}
                showInfo={false}
                strokeColor="#2F6FED"
                size="small"
              />
            )}
          </div>
        ))}
      </Space>
    </Card>
  );
}
