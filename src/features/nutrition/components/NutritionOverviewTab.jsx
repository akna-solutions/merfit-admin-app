import React from "react";
import { Row, Col } from "antd";
import dayjs from "dayjs";
import { MetricCard, SectionCard, DataTable } from "../../../components/admin";
import { useNutritionOverview } from "../hooks/useNutritionOverview";
import { AppleOutlined, FireOutlined, ThunderboltOutlined } from "@ant-design/icons";

const mealColumns = [
  { title: "Kullanıcı", dataIndex: "userEmail", key: "userEmail" },
  { title: "Tarih", dataIndex: "date", key: "date", render: (v) => dayjs(v).format("DD MMM YYYY") },
  { title: "Ürün Sayısı", dataIndex: "itemCount", key: "itemCount", width: 90 },
  { title: "Toplam Kalori", dataIndex: "totalCalories", key: "totalCalories", width: 130 },
];

export default function NutritionOverviewTab() {
  const { loading, stats, recentMeals } = useNutritionOverview();

  return (
    <div className="merfit-page" style={{ gap: 20 }}>
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={8}>
          <MetricCard title="Toplam Besin" value={stats.totalFoods} icon={<AppleOutlined />} loading={loading} />
        </Col>
        <Col xs={24} sm={8}>
          <MetricCard title="Ortalama Kalori" value={stats.avgCalories} icon={<FireOutlined />} loading={loading} />
        </Col>
        <Col xs={24} sm={8}>
          <MetricCard title="Ortalama Protein (g)" value={stats.avgProtein} icon={<ThunderboltOutlined />} loading={loading} />
        </Col>
      </Row>
      <SectionCard title="Son Beslenme Etkinliği">
        <DataTable
          columns={mealColumns}
          dataSource={recentMeals}
          loading={loading}
          pagination={false}
          scrollX={600}
          emptyDescription="Henüz öğün kaydedilmedi."
        />
      </SectionCard>
    </div>
  );
}
