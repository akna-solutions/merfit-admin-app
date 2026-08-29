import React from "react";
import { Row, Col, Card, List, Progress } from "antd";
import { ThunderboltOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { MetricCard } from "../../../components/admin";
import { useAnalyticsSnapshot } from "../../analytics/hooks/useAnalyticsSnapshot";
import { aiService } from "../services/aiService";

function DistributionList({ title, items, loading }) {
  const total = items?.reduce((sum, i) => sum + i.count, 0) || 1;
  return (
    <Card title={title} bordered={false} className="merfit-table-card" loading={loading}>
      <List
        dataSource={items ?? []}
        renderItem={(item) => (
          <List.Item>
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span>{item.key}</span>
                <span>{item.count}</span>
              </div>
              <Progress percent={Math.round((item.count / total) * 100)} showInfo={false} size="small" />
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
}

export default function StatisticsTab() {
  const { data, loading } = useAnalyticsSnapshot(aiService.getStatistics);
  const d = data ?? {};

  return (
    <div className="merfit-page" style={{ gap: 20 }}>
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} lg={6}><MetricCard title="Total Requests" value={d.totalRequests} icon={<ThunderboltOutlined />} loading={loading} /></Col>
        <Col xs={24} sm={12} lg={6}><MetricCard title="Successful" value={d.successfulRequests} icon={<CheckCircleOutlined />} loading={loading} /></Col>
        <Col xs={24} sm={12} lg={6}><MetricCard title="Failed" value={d.failedRequests} icon={<CloseCircleOutlined />} loading={loading} /></Col>
        <Col xs={24} sm={12} lg={6}><MetricCard title="Pending" value={d.pendingRequests} icon={<ClockCircleOutlined />} loading={loading} /></Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12}><MetricCard title="Average Duration" value={d.averageDurationSeconds} suffix="s" loading={loading} /></Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Col xs={24} md={12}>
          <DistributionList title="Model Usage" items={d.modelDistribution} loading={loading} />
        </Col>
        <Col xs={24} md={12}>
          <DistributionList title="Request Type Distribution" items={d.requestTypeDistribution} loading={loading} />
        </Col>
      </Row>
    </div>
  );
}
