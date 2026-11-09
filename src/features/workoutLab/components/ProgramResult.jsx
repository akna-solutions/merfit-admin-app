import React from "react";
import { Alert, Col, Collapse, Descriptions, Row, Space, Table, Tag, Typography } from "antd";
import {
  AimOutlined, CalendarOutlined, ClockCircleOutlined, FireOutlined, OrderedListOutlined, RiseOutlined, ToolOutlined,
} from "@ant-design/icons";
import { MetricCard, SectionCard, EmptyState } from "../../../components/admin";
import {
  DAY_LABELS, EQUIPMENT_RESOLUTION_LABELS, POOL_STAGE_LABELS, difficultyLabel, experienceLabel, fitnessGoalLabel, repsLabel,
} from "../utils/labLabels";

const { Text } = Typography;

const exerciseColumns = [
  { title: "#", dataIndex: "order", key: "order", width: 48 },
  { title: "Egzersiz", dataIndex: "name", key: "name", width: 200, render: (v) => <Text strong>{v}</Text> },
  { title: "Kas grubu", dataIndex: "muscleGroupName", key: "muscle", width: 130, render: (v) => v ?? "—" },
  { title: "Set", dataIndex: "sets", key: "sets", width: 60, render: (v) => v ?? "—" },
  { title: "Tekrar", key: "reps", width: 90, render: (_, r) => repsLabel(r) },
  { title: "Dinlenme", dataIndex: "restSeconds", key: "rest", width: 90, render: (v) => (v != null ? `${v} sn` : "—") },
  { title: "Süre", dataIndex: "durationSeconds", key: "duration", width: 80, render: (v) => (v ? `${v} sn` : "—") },
  { title: "Ekipman", dataIndex: "equipmentType", key: "equipment", width: 130, render: (v) => v || <Text type="secondary">Yok</Text> },
  {
    title: "Tür",
    dataIndex: "kind",
    key: "kind",
    width: 90,
    render: (v) => (v === "Cardio" ? <Tag color="volcano">Kardiyo</Tag> : <Tag color="blue">Ana</Tag>),
  },
];

function WorkoutLine({ label, workout }) {
  if (!workout) return null;
  return (
    <Space wrap size={6}>
      <Text type="secondary">{label}:</Text>
      <Text strong>{workout.title}</Text>
      <Tag>{difficultyLabel(workout.difficulty)}</Tag>
      <Tag>{workout.durationMin} dk</Tag>
      {workout.muscleGroupName && <Tag>{workout.muscleGroupName}</Tag>}
      {workout.isPremium && <Tag color="gold">Premium</Tag>}
      {workout.isCardioDominant && <Tag color="volcano">Kardiyo ağırlıklı</Tag>}
      <Text type="secondary" style={{ fontSize: 12 }}>
        uygunluk {Math.round(workout.fitScore ?? 0)} · H {workout.hypertrophy ?? "—"} / G {workout.strength ?? "—"} / K {workout.cardioScore ?? "—"}
      </Text>
    </Space>
  );
}

function DayPanelLabel({ day }) {
  const count = (day.exercises?.length ?? 0) + (day.cardioExercises?.length ?? 0);
  return (
    <Space wrap size={6}>
      <Text strong>{DAY_LABELS[day.dayOfWeek] ?? day.dayOfWeek}</Text>
      <Text type="secondary">{day.workout?.title ?? "—"}</Text>
      <Tag>{count} egzersiz</Tag>
      <Tag icon={<ClockCircleOutlined />}>{day.estimatedDurationMin} dk</Tag>
      {day.cardio && <Tag color="volcano">+ Kardiyo</Tag>}
      {day.isMixedCardioDay && <Tag color="purple">Karma gün</Tag>}
    </Space>
  );
}

function DayContent({ day }) {
  const rows = [...(day.exercises ?? []), ...(day.cardioExercises ?? [])];
  return (
    <Space orientation="vertical" style={{ width: "100%" }} size={8}>
      <WorkoutLine label="Ana antrenman" workout={day.workout} />
      <WorkoutLine label="Kardiyo" workout={day.cardio} />
      {day.truncatedExerciseCount > 0 && (
        <Text type="secondary">
          Günlük egzersiz sınırı nedeniyle {day.truncatedExerciseCount} egzersiz programa alınmadı.
        </Text>
      )}
      <Table
        size="small"
        rowKey={(r) => `${r.kind}-${r.exerciseId}-${r.order}`}
        columns={exerciseColumns}
        dataSource={rows}
        pagination={false}
        scroll={{ x: 860 }}
        locale={{ emptyText: <EmptyState description="Bu günde egzersiz yok." /> }}
      />
    </Space>
  );
}

// MerfitCustomerApi'nin gerçek WorkoutPlanGenerator ile ürettiği sonucun anlık görüntüsü.
// Yalnızca ResultJson'da bulunan alanlar gösterilir.
export default function ProgramResult({ result }) {
  if (!result) return <EmptyState description="Sonuç yok." />;
  const m = result.metrics ?? {};
  const days = result.days ?? [];
  const fallbackUsed = result.poolStage && result.poolStage !== "Primary";

  return (
    <Space orientation="vertical" size={16} style={{ width: "100%" }}>
      <Row gutter={[12, 12]}>
        <Col xs={12} md={8} xl={6}>
          <MetricCard title="Hedef" value={fitnessGoalLabel(result.goal)} icon={<AimOutlined />} />
        </Col>
        <Col xs={12} md={8} xl={6}>
          <MetricCard title="Deneyim" value={experienceLabel(result.experience)} icon={<RiseOutlined />} />
        </Col>
        <Col xs={12} md={8} xl={6}>
          <MetricCard title="Gün sayısı" value={days.length} icon={<CalendarOutlined />} />
        </Col>
        <Col xs={12} md={8} xl={6}>
          <MetricCard title="Toplam egzersiz" value={m.totalExercises ?? 0} icon={<OrderedListOutlined />} />
        </Col>
        <Col xs={12} md={8} xl={6}>
          <MetricCard title="Kullanılan ekipman" value={m.usedEquipmentCount ?? 0} icon={<ToolOutlined />} />
        </Col>
        <Col xs={12} md={8} xl={6}>
          <MetricCard title="Ortalama süre" value={m.averageDurationMin ?? 0} suffix="dk" icon={<ClockCircleOutlined />} />
        </Col>
        <Col xs={12} md={8} xl={6}>
          <MetricCard title="Kardiyo günü" value={result.cardioDays ?? 0} suffix={`/ ${result.cardioTarget ?? 0} hedef`} icon={<FireOutlined />} />
        </Col>
        <Col xs={12} md={8} xl={6}>
          <MetricCard title="Toplam set" value={m.totalSets ?? 0} icon={<OrderedListOutlined />} />
        </Col>
      </Row>

      {(fallbackUsed || result.premiumLastResortUsed || result.cardioDominantMainDaysFallback) && (
        <Alert
          type="warning"
          showIcon
          title="Algoritma yedek (fallback) yol kullandı"
          description={
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {fallbackUsed && <li>{POOL_STAGE_LABELS[result.poolStage] ?? result.poolStage}</li>}
              {result.premiumLastResortUsed && <li>Free profile premium antrenmanlar son çare olarak açıldı.</li>}
              {result.cardioDominantMainDaysFallback && <li>Ana günlerde kardiyo ağırlıklı antrenman kullanıldı.</li>}
            </ul>
          }
        />
      )}

      <SectionCard title="Algoritma girdileri ve kurallar">
        <Descriptions size="small" column={{ xs: 1, sm: 2, lg: 3 }} bordered>
          <Descriptions.Item label="Plan adı">{result.planName}</Descriptions.Item>
          <Descriptions.Item label="Hedef zorluk">{difficultyLabel(result.targetDifficulty)}</Descriptions.Item>
          <Descriptions.Item label="Hedef gün sayısı">
            {result.targetTrainingDays != null ? `${result.targetTrainingDays} gün (deneyim + hedef)` : "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Müsait günler">
            {result.availableDays?.length ? result.availableDays.map((d) => DAY_LABELS[d] ?? d).join(", ") : "Tüm hafta"}
          </Descriptions.Item>
          <Descriptions.Item label="Süre tercihi">
            {result.durationPreferenceMin} dk{result.usedDefaultDuration ? " (varsayılan)" : ""} · en fazla {result.maxDurationMin} dk
          </Descriptions.Item>
          <Descriptions.Item label="Set / tekrar / dinlenme">
            {result.setsRule} set · {result.repsMinRule}-{result.repsMaxRule} tekrar · {result.restSecondsRule} sn
          </Descriptions.Item>
          <Descriptions.Item label="Günlük egzersiz sınırı">{result.maxExercisesPerDay}</Descriptions.Item>
          <Descriptions.Item label="Ekipman">
            {EQUIPMENT_RESOLUTION_LABELS[result.equipmentResolution] ?? result.equipmentResolution}
            {result.equipment?.length > 0 && ` (${result.equipment.length})`}
          </Descriptions.Item>
          <Descriptions.Item label="Aday havuzu">{POOL_STAGE_LABELS[result.poolStage] ?? result.poolStage}</Descriptions.Item>
          <Descriptions.Item label="Uygun / ana havuz">{result.eligibleCount} / {result.mainPoolCount}</Descriptions.Item>
          <Descriptions.Item label="Premium">{result.includePremium ? "Dahil" : "Hariç"}</Descriptions.Item>
          <Descriptions.Item label="Algoritma sürümü">{result.algorithmVersion}</Descriptions.Item>
          <Descriptions.Item label="Seçenek parmak izi">{result.optionsFingerprint}</Descriptions.Item>
        </Descriptions>
        {result.unknownEquipmentIds?.length > 0 && (
          <Text type="warning" style={{ display: "block", marginTop: 8 }}>
            Katalogda bulunmayan ekipmanlar yok sayıldı: {result.unknownEquipmentIds.join(", ")}
          </Text>
        )}
        {result.summary && <Text type="secondary" style={{ display: "block", marginTop: 8 }}>{result.summary}</Text>}
      </SectionCard>

      <SectionCard title="Günler" bodyPadding={days.length ? 0 : undefined}>
        {days.length === 0 ? (
          <EmptyState description="Program gün içermiyor." />
        ) : (
          <Collapse
            bordered={false}
            defaultActiveKey={days.length ? [days[0].dayOfWeek] : []}
            items={days.map((day) => ({
              key: day.dayOfWeek,
              label: <DayPanelLabel day={day} />,
              children: <DayContent day={day} />,
            }))}
          />
        )}
      </SectionCard>

      {m.muscleGroups?.length > 0 && (
        <SectionCard title="Kas grubu dağılımı">
          <Table
            size="small"
            rowKey="name"
            pagination={false}
            dataSource={m.muscleGroups}
            scroll={{ x: 480 }}
            columns={[
              { title: "Kas grubu", dataIndex: "name", key: "name" },
              { title: "Egzersiz", dataIndex: "exerciseCount", key: "exerciseCount", width: 100 },
              { title: "Set", dataIndex: "sets", key: "sets", width: 80 },
              { title: "Gün", dataIndex: "dayCount", key: "dayCount", width: 80 },
            ]}
          />
        </SectionCard>
      )}
    </Space>
  );
}
