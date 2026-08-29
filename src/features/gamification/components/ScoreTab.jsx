import React, { useEffect, useState } from "react";
import { Row, Col, Button, App } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { SectionCard, DataTable, MetricCard, EntityCell } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { scoreService } from "../services/gamificationService";
import dayjs from "dayjs";

export default function ScoreTab() {
  const { message } = App.useApp();
  const {
    rows, total, loading, page, pageSize, setPage, setPageSize, refetch,
  } = useListQuery(scoreService.getScores, { search: "" });

  const [stats, setStats] = useState({ average: 0, highest: 0, lowest: 0 });

  useEffect(() => {
    scoreService.getScores({ page: 1, pageSize: 1000 }).then((res) => {
      const values = res.data.items.map((s) => s.score);
      if (!values.length) return;
      setStats({
        average: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
        highest: Math.max(...values),
        lowest: Math.min(...values),
      });
    });
  }, [rows]);

  const handleRecalculate = async (record) => {
    await scoreService.recalculate(record.userId);
    message.success(`Recalculated score for ${record.userEmail}.`);
    refetch();
  };

  const columns = [
    {
      title: "User",
      key: "user",
      width: 240,
      render: (_, r) => <EntityCell title={r.userEmail} subtitle={`#${r.userId}`} avatarColor="#F5A623" />,
    },
    { title: "Score", dataIndex: "score", key: "score", width: 100, sorter: (a, b) => a.score - b.score },
    { title: "Period", dataIndex: "period", key: "period", width: 120 },
    {
      title: "Updated At",
      dataIndex: "calculatedAt",
      key: "calculatedAt",
      width: 150,
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : "—"),
    },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 140,
      render: (_, record) => (
        <Button size="small" icon={<ReloadOutlined />} onClick={() => handleRecalculate(record)}>
          Recalculate
        </Button>
      ),
    },
  ];

  return (
    <div className="merfit-page" style={{ gap: 20 }}>
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={8}><MetricCard title="Average Score" value={stats.average} loading={loading} /></Col>
        <Col xs={24} sm={8}><MetricCard title="Highest Score" value={stats.highest} loading={loading} /></Col>
        <Col xs={24} sm={8}><MetricCard title="Lowest Score" value={stats.lowest} loading={loading} /></Col>
      </Row>
      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={800}
          emptyDescription="No scores recorded yet."
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: (nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            },
          }}
        />
      </SectionCard>
    </div>
  );
}
