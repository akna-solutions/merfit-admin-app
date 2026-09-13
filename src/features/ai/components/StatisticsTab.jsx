import React from "react";
import { Row, Col, Card, List, Progress } from "antd";
import { ThunderboltOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { MetricCard } from "../../../components/admin";
import { useAnalyticsSnapshot } from "../../analytics/hooks/useAnalyticsSnapshot";
import { aiService } from "../services/aiService";

// Display-only labels for the underlying request type values (values used
// for filtering and matching stay in English — only the rendered text is
// translated here). Model distribution keys are model identifiers and are
// left untranslated.
const TYPE_LABELS = { Workout: "Antrenman", Nutrition: "Beslenme", Insight: "İçgörü" };

function DistributionList({ title, items, loading, labelMap }) {
  const total = items?.reduce((sum, i) => sum + i.count, 0) || 1;
  return (
    <Card title={title} bordered={false} className="mbfit-table-card" loading={loading}>
      <List
        dataSource={items ?? []}
        renderItem={(item) => (
          <List.Item>
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span>{labelMap?.[item.key] ?? item.key}</span>
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
    <div className="mbfit-page" style={{ gap: 20 }}>
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} lg={6}><MetricCard title="Toplam İstek" value={d.totalRequests} icon={<ThunderboltOutlined />} loading={loading} /></Col>
        <Col xs={24} sm={12} lg={6}><MetricCard title="Başarılı" value={d.successfulRequests} icon={<CheckCircleOutlined />} loading={loading} /></Col>
        <Col xs={24} sm={12} lg={6}><MetricCard title="Başarısız" value={d.failedRequests} icon={<CloseCircleOutlined />} loading={loading} /></Col>
        <Col xs={24} sm={12} lg={6}><MetricCard title="Beklemede" value={d.pendingRequests} icon={<ClockCircleOutlined />} loading={loading} /></Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12}><MetricCard title="Ortalama Süre" value={d.averageDurationSeconds} suffix="s" loading={loading} /></Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Col xs={24} md={12}>
          <DistributionList title="Model Kullanımı" items={d.modelDistribution} loading={loading} />
        </Col>
        <Col xs={24} md={12}>
          <DistributionList title="İstek Türü Dağılımı" items={d.requestTypeDistribution} loading={loading} labelMap={TYPE_LABELS} />
        </Col>
      </Row>
    </div>
  );
}
