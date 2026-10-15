import React, { useEffect, useState } from "react";
import {
  Alert, Button, Collapse, Empty, InputNumber, Progress, Slider, Space, Table, Tag, Tooltip, Typography, App,
} from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { WORKOUT_ATTRIBUTE_TYPE } from "../../../constants/apiEnums";
import { workoutService } from "../services/workoutService";
import { PRIMARY_WORKOUT_ATTRIBUTES, workoutAttributeLabel } from "../data/enumLabels";
import { missingPrimaryAttributes } from "../data/attributeScoreRules";

const { Text } = Typography;

const SECONDARY_WORKOUT_ATTRIBUTES = WORKOUT_ATTRIBUTE_TYPE.filter((t) => !PRIMARY_WORKOUT_ATTRIBUTES.includes(t));

// AdminWorkoutAttributeScoresDto -> { Hypertrophy: 70, Strength: null, ... }.
// null means "not scored".
function toValueMap(dto) {
  const map = Object.fromEntries(WORKOUT_ATTRIBUTE_TYPE.map((t) => [t, null]));
  (dto?.scores ?? []).forEach((s) => {
    map[s.attributeType] = s.score;
  });
  return map;
}

function ScoreRow({ type, value, loading, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Text style={{ width: 170, flexShrink: 0 }}>{workoutAttributeLabel(type)}</Text>
      <Slider
        min={0}
        max={100}
        value={value ?? 0}
        disabled={loading}
        onChange={(v) => onChange(type, v)}
        style={{ flex: 1, opacity: value === null ? 0.4 : 1 }}
      />
      <InputNumber
        min={0}
        max={100}
        precision={0}
        value={value}
        placeholder="—"
        disabled={loading}
        onChange={(v) => onChange(type, v)}
        style={{ width: 72 }}
      />
      <Tooltip title="Puanı kaldır">
        <Button
          type="text"
          icon={<CloseCircleOutlined />}
          disabled={loading || value === null}
          onClick={() => onChange(type, null)}
        />
      </Tooltip>
    </div>
  );
}

// Scores are managed through their own replace-all endpoint
// (PUT /api/admin/workouts/{id}/attribute-scores), so like the exercises
// editor they get a separate save action. Clearing a value removes that
// score on save.
export function AttributeScoresEditor({ workoutId }) {
  const { message } = App.useApp();
  const [values, setValues] = useState(() => toValueMap(null));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!workoutId) return;
    setLoading(true);
    workoutService
      .getAttributeScores(workoutId)
      .then((res) => setValues(toValueMap(res.data)))
      .finally(() => setLoading(false));
  }, [workoutId]);

  const setValue = (type, value) =>
    setValues((prev) => ({ ...prev, [type]: value === undefined ? null : value }));

  const missingPrimary = missingPrimaryAttributes(values);

  const handleSave = async () => {
    if (missingPrimary.length > 0) {
      message.error(`Hipertrofi, Kuvvet ve Kardiyo birlikte puanlanmalıdır (eksik: ${missingPrimary.map(workoutAttributeLabel).join(", ")}).`);
      return;
    }
    setSaving(true);
    try {
      const scores = WORKOUT_ATTRIBUTE_TYPE
        .map((type, index) => ({ attributeType: index, score: values[type] }))
        .filter((s) => s.score !== null);
      const res = await workoutService.setAttributeScores(workoutId, { scores });
      setValues(toValueMap(res.data));
      message.success("Özellik puanları kaydedildi.");
    } catch (error) {
      message.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!workoutId) {
    return <Empty description="Puan girmek için önce antrenmanı kaydedin." />;
  }

  const primaryUnscored = PRIMARY_WORKOUT_ATTRIBUTES.every((t) => values[t] === null);

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={12}>
      <Text type="secondary">
        Program üretimi bu üç ana puanı kullanır (0-100). Hedef ağırlıkları: Kas Geliştirme 65/25/10,
        Güçlenme 25/65/10, Yağ Kaybı 45/25/30 (Hipertrofi/Kuvvet/Kardiyo). Kardiyo puanı hipertrofi ve
        kuvvetten yüksek olan antrenmanlar ana gün olarak değil, antrenman sonu kardiyo olarak kullanılır.
      </Text>
      {PRIMARY_WORKOUT_ATTRIBUTES.map((type) => (
        <ScoreRow key={type} type={type} value={values[type]} loading={loading} onChange={setValue} />
      ))}
      {!loading && missingPrimary.length > 0 && (
        <Alert
          type="warning"
          showIcon
          message={`Üç ana puan birlikte girilmelidir. Eksik: ${missingPrimary.map(workoutAttributeLabel).join(", ")}.`}
        />
      )}
      {!loading && primaryUnscored && (
        <Alert
          type="info"
          showIcon
          message="Bu antrenman puanlanmamış. Program üretiminde hedef uyumu katkısı almaz; yalnızca seviye, süre ve öne çıkan bilgisiyle sıralanır."
        />
      )}
      <Collapse
        size="small"
        items={[
          {
            key: "secondary",
            label: "İkincil özellikler (bilgi amaçlı, program üretimini etkilemez)",
            children: (
              <Space direction="vertical" style={{ width: "100%" }} size={12}>
                {SECONDARY_WORKOUT_ATTRIBUTES.map((type) => (
                  <ScoreRow key={type} type={type} value={values[type]} loading={loading} onChange={setValue} />
                ))}
              </Space>
            ),
          },
        ]}
      />
      <Button type="primary" onClick={handleSave} loading={saving} disabled={loading || missingPrimary.length > 0}>
        Puanları Kaydet
      </Button>
    </Space>
  );
}

// Read-only view for the detail drawer.
export function AttributeScoresView({ scores, loading }) {
  const values = toValueMap(scores);
  const columns = [
    {
      title: "Özellik",
      dataIndex: "type",
      key: "type",
      width: 220,
      render: (t) => (
        <Space size={6}>
          {workoutAttributeLabel(t)}
          {PRIMARY_WORKOUT_ATTRIBUTES.includes(t) ? <Tag color="blue">Ana</Tag> : null}
        </Space>
      ),
    },
    {
      title: "Puan",
      dataIndex: "score",
      key: "score",
      render: (v, row) =>
        v === null
          ? <Tag color={PRIMARY_WORKOUT_ATTRIBUTES.includes(row.type) ? "orange" : undefined}>Puanlanmadı</Tag>
          : <Progress percent={v} size="small" format={(p) => p} />,
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={[...PRIMARY_WORKOUT_ATTRIBUTES, ...SECONDARY_WORKOUT_ATTRIBUTES].map((type) => ({ type, score: values[type] }))}
      rowKey="type"
      size="small"
      loading={loading}
      pagination={false}
    />
  );
}
