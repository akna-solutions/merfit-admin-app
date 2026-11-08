import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Row, Select, Space, Spin, Table, Tag, Typography } from "antd";
import { SwapOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { EmptyState, SectionCard } from "../../../components/admin";
import { workoutLabService } from "../services/workoutLabService";
import { checkRows, dayDistribution, dayRows, metricRows, muscleGroupRows, profileDiff } from "../utils/comparison";
import { CHECK_STATUS_LABELS, DAY_LABELS, experienceLabel, fitnessGoalLabel, locationLabel } from "../utils/labLabels";

const { Text } = Typography;
const CHECK_COLORS = { Passed: "green", Warning: "gold", Failed: "red" };

const PROFILE_FIELD_LABELS = {
  age: "Yaş", gender: "Cinsiyet", heightCm: "Boy", weightKg: "Kilo", targetWeightKg: "Hedef kilo", goal: "Hedef",
  experienceLevel: "Deneyim", trainingLocation: "Yer", equipmentIds: "Ekipman", noEquipment: "Ekipmansız",
  trainingDaysPerWeek: "Gün sayısı", trainingDays: "Belirli günler", workoutDurationMin: "Süre", isPlus: "Plus",
};

const simLabel = (s) =>
  `#${s.id} ${s.name || ""} · ${fitnessGoalLabel(s.goal)} · ${experienceLabel(s.experienceLevel)} · ${locationLabel(s.trainingLocation)} · ${s.algorithmVersion ?? "—"}`;

const changedStyle = (changed) => (changed ? { background: "rgba(250, 173, 20, 0.12)" } : undefined);

function DayStrip({ result }) {
  return (
    <Space size={4} wrap>
      {dayDistribution(result).map((d) => (
        <Tag key={d.code} color={d.active ? "blue" : undefined} style={{ minWidth: 40, textAlign: "center" }}>
          {d.label}
        </Tag>
      ))}
    </Space>
  );
}

function SideHeader({ sim, side }) {
  return (
    <Space orientation="vertical" size={2}>
      <Text type="secondary">{side}</Text>
      <Text strong>{sim.name || `Test #${sim.id}`}</Text>
      <Text type="secondary" style={{ fontSize: 12 }}>
        #{sim.id} · algoritma {sim.algorithmVersion ?? "—"} · parmak izi {sim.optionsFingerprint ?? "—"} ·{" "}
        {dayjs(sim.createdAt).format("DD MMM YYYY HH:mm")}
      </Text>
      <DayStrip result={sim.result} />
    </Space>
  );
}

function ComparisonBody({ data }) {
  const { left, right } = data;
  const lr = left.result;
  const rr = right.result;
  const diffs = profileDiff(left.profile, right.profile);

  const metricColumns = [
    { title: "Ölçüt", dataIndex: "label", key: "label", width: 180 },
    { title: "A", dataIndex: "l", key: "l", render: (v) => String(v) },
    { title: "B", dataIndex: "r", key: "r", render: (v) => String(v) },
  ];

  const dayColumns = [
    { title: "Gün", dataIndex: "code", key: "code", width: 110, render: (v) => DAY_LABELS[v] ?? v },
    {
      title: "A",
      key: "left",
      render: (_, r) =>
        r.left ? (
          <span>{r.left.workout?.title ?? "—"}{r.left.cardio ? ` + ${r.left.cardio.title}` : ""} <Text type="secondary">({r.left.estimatedDurationMin} dk)</Text></span>
        ) : <Text type="secondary">Dinlenme</Text>,
    },
    {
      title: "B",
      key: "right",
      render: (_, r) =>
        r.right ? (
          <span>{r.right.workout?.title ?? "—"}{r.right.cardio ? ` + ${r.right.cardio.title}` : ""} <Text type="secondary">({r.right.estimatedDurationMin} dk)</Text></span>
        ) : <Text type="secondary">Dinlenme</Text>,
    },
  ];

  const muscleColumns = [
    { title: "Kas grubu", dataIndex: "name", key: "name", width: 160 },
    { title: "A (egzersiz / set / gün)", key: "l", render: (_, r) => (r.left ? `${r.left.exerciseCount} / ${r.left.sets} / ${r.left.dayCount}` : "—") },
    { title: "B (egzersiz / set / gün)", key: "r", render: (_, r) => (r.right ? `${r.right.exerciseCount} / ${r.right.sets} / ${r.right.dayCount}` : "—") },
  ];

  const checkColumns = [
    { title: "Kontrol", dataIndex: "title", key: "title", width: 200 },
    {
      title: "A",
      key: "l",
      render: (_, r) => (r.left ? <Tag color={CHECK_COLORS[r.left.status]} title={r.left.message}>{CHECK_STATUS_LABELS[r.left.status]}</Tag> : "—"),
    },
    {
      title: "B",
      key: "r",
      render: (_, r) => (r.right ? <Tag color={CHECK_COLORS[r.right.status]} title={r.right.message}>{CHECK_STATUS_LABELS[r.right.status]}</Tag> : "—"),
    },
  ];

  return (
    <Space orientation="vertical" size={16} style={{ width: "100%" }}>
      <SectionCard>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}><SideHeader sim={left} side="A" /></Col>
          <Col xs={24} md={12}><SideHeader sim={right} side="B" /></Col>
        </Row>
        <Space wrap style={{ marginTop: 12 }}>
          <Tag color={data.sameProfile ? "green" : "orange"}>{data.sameProfile ? "Aynı profil" : "Farklı profil"}</Tag>
          <Tag color={data.sameAlgorithmVersion ? "green" : "purple"}>
            {data.sameAlgorithmVersion ? "Aynı algoritma sürümü" : "Farklı algoritma sürümü"}
          </Tag>
          <Tag color={data.sameOptionsFingerprint ? "green" : "purple"}>
            {data.sameOptionsFingerprint ? "Aynı ayarlar" : "Farklı algoritma ayarları"}
          </Tag>
        </Space>
        {diffs.length > 0 && (
          <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
            Profilde farklı alanlar: {diffs.map((k) => PROFILE_FIELD_LABELS[k] ?? k).join(", ")}
          </Text>
        )}
        {(!lr || !rr) && (
          <Alert style={{ marginTop: 12 }} type="warning" showIcon title="Taraflardan birinin sonucu yok (tamamlanmamış veya başarısız test)." />
        )}
      </SectionCard>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <SectionCard title="Özet ölçütler" bodyPadding={0}>
            <Table size="small" rowKey="key" pagination={false} columns={metricColumns} dataSource={metricRows(lr, rr)}
              onRow={(r) => ({ style: changedStyle(r.changed) })} scroll={{ x: 420 }} />
          </SectionCard>
        </Col>
        <Col xs={24} xl={12}>
          <SectionCard title="Kalite kontrolleri" bodyPadding={0}>
            <Table size="small" rowKey="code" pagination={false} columns={checkColumns}
              dataSource={checkRows(left.qualityChecks, right.qualityChecks)}
              onRow={(r) => ({ style: changedStyle(r.changed) })} scroll={{ x: 420 }} />
          </SectionCard>
        </Col>
      </Row>

      <SectionCard title="Gün dağılımı" bodyPadding={0}>
        <Table size="small" rowKey="code" pagination={false} columns={dayColumns} dataSource={dayRows(lr, rr)}
          onRow={(r) => ({ style: changedStyle(r.changed) })} scroll={{ x: 640 }}
          locale={{ emptyText: <EmptyState description="Gün yok." /> }} />
      </SectionCard>

      <SectionCard title="Kas grubu dağılımı" bodyPadding={0}>
        <Table size="small" rowKey="name" pagination={false} columns={muscleColumns} dataSource={muscleGroupRows(lr, rr)}
          onRow={(r) => ({ style: changedStyle(JSON.stringify(r.left) !== JSON.stringify(r.right)) })} scroll={{ x: 520 }}
          locale={{ emptyText: <EmptyState description="Kas grubu verisi yok." /> }} />
      </SectionCard>
      <Text type="secondary" style={{ fontSize: 12 }}>Farklı olan satırlar sarı ile vurgulanır.</Text>
    </Space>
  );
}

// İki testi yan yana karşılaştırır. Aynı profil + farklı algoritma sürümü, algoritma değişikliğinin etkisini gösterir.
export default function CompareView({ initialLeftId, initialRightId }) {
  const [choices, setChoices] = useState([]);
  const [choicesLoading, setChoicesLoading] = useState(true);
  const [leftId, setLeftId] = useState(initialLeftId ?? null);
  const [rightId, setRightId] = useState(initialRightId ?? null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    workoutLabService
      .getSimulations({ status: "Completed", page: 1, pageSize: 100, sortBy: "id", sortDirection: "desc" })
      .then((r) => !cancelled && setChoices(r.data.items ?? []))
      .catch(() => !cancelled && setChoices([]))
      .finally(() => !cancelled && setChoicesLoading(false));
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    setLeftId(initialLeftId ?? null);
    setRightId(initialRightId ?? null);
  }, [initialLeftId, initialRightId]);

  useEffect(() => {
    if (!leftId || !rightId || leftId === rightId) {
      setData(null);
      return undefined;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    workoutLabService
      .compare(leftId, rightId)
      .then((r) => !cancelled && setData(r.data))
      .catch((e) => !cancelled && setError(e?.message || "Karşılaştırma yüklenemedi."))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [leftId, rightId]);

  const options = choices.map((s) => ({ value: s.id, label: simLabel(s) }));
  // Seçili test listede yoksa (ör. 100'den eski) yine de seçili görünsün.
  [leftId, rightId].forEach((id) => {
    if (id && !options.some((o) => o.value === id)) options.push({ value: id, label: `#${id}` });
  });

  return (
    <Space orientation="vertical" size={16} style={{ width: "100%" }}>
      <SectionCard title="Karşılaştırılacak testler">
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} md={11}>
            <Select showSearch optionFilterProp="label" allowClear loading={choicesLoading} style={{ width: "100%" }}
              placeholder="A testi" value={leftId ?? undefined} options={options} onChange={(v) => setLeftId(v ?? null)} />
          </Col>
          <Col xs={24} md={2} style={{ textAlign: "center" }}>
            <Button icon={<SwapOutlined />} aria-label="Tarafları değiştir" onClick={() => { setLeftId(rightId); setRightId(leftId); }} />
          </Col>
          <Col xs={24} md={11}>
            <Select showSearch optionFilterProp="label" allowClear loading={choicesLoading} style={{ width: "100%" }}
              placeholder="B testi" value={rightId ?? undefined} options={options} onChange={(v) => setRightId(v ?? null)} />
          </Col>
        </Row>
        {leftId && rightId && leftId === rightId && (
          <Alert style={{ marginTop: 12 }} type="info" showIcon title="İki farklı test seçin." />
        )}
      </SectionCard>

      {error && <Alert type="error" showIcon title={error} />}
      {loading && <div style={{ textAlign: "center", padding: 32 }}><Spin /></div>}
      {!loading && !data && !error && (
        <SectionCard>
          <EmptyState description="Karşılaştırmak için iki tamamlanmış test seçin. Geçmiş sekmesinden de iki test işaretleyebilirsiniz." />
        </SectionCard>
      )}
      {!loading && data && <ComparisonBody data={data} />}
    </Space>
  );
}
