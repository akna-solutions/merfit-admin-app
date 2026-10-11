import React, { useEffect, useState } from "react";
import {
  Alert, Button, Empty, InputNumber, Progress, Slider, Space, Table, Tag, Tooltip, Typography, App,
} from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { WORKOUT_ATTRIBUTE_TYPE } from "../../../constants/apiEnums";
import { workoutService } from "../services/workoutService";
import { workoutAttributeLabel } from "../data/enumLabels";

const { Text } = Typography;

// AdminWorkoutAttributeScoresDto -> { Hypertrophy: 70, Strength: null, ... }.
// null means "not scored": the personalization engine then ignores that
// attribute for this workout instead of treating it as 0.
function toValueMap(dto) {
  const map = Object.fromEntries(WORKOUT_ATTRIBUTE_TYPE.map((t) => [t, null]));
  (dto?.scores ?? []).forEach((s) => {
    map[s.attributeType] = s.score;
  });
  return map;
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

  const handleSave = async () => {
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

  const missingCount = WORKOUT_ATTRIBUTE_TYPE.filter((t) => values[t] === null).length;

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={12}>
      <Text type="secondary">
        Her özellik için 0-100 arası puan girin. Boş bırakılan özellik puanlanmamış sayılır ve
        kişiselleştirmede hesaba katılmaz (0 olarak değerlendirilmez).
      </Text>
      {WORKOUT_ATTRIBUTE_TYPE.map((type) => {
        const value = values[type];
        return (
          <div key={type} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Text style={{ width: 170, flexShrink: 0 }}>{workoutAttributeLabel(type)}</Text>
            <Slider
              min={0}
              max={100}
              value={value ?? 0}
              disabled={loading}
              onChange={(v) => setValue(type, v)}
              style={{ flex: 1, opacity: value === null ? 0.4 : 1 }}
            />
            <InputNumber
              min={0}
              max={100}
              precision={0}
              value={value}
              placeholder="—"
              disabled={loading}
              onChange={(v) => setValue(type, v)}
              style={{ width: 72 }}
            />
            <Tooltip title="Puanı kaldır">
              <Button
                type="text"
                icon={<CloseCircleOutlined />}
                disabled={loading || value === null}
                onClick={() => setValue(type, null)}
              />
            </Tooltip>
          </div>
        );
      })}
      {missingCount > 0 && !loading && (
        <Alert
          type="info"
          showIcon
          message={`${missingCount} özellik puanlanmamış. Kaydettiğinizde boş bırakılan özelliklerin mevcut puanları silinir.`}
        />
      )}
      <Button type="primary" onClick={handleSave} loading={saving} disabled={loading}>
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
      width: 190,
      render: (t) => workoutAttributeLabel(t),
    },
    {
      title: "Puan",
      dataIndex: "score",
      key: "score",
      render: (v) =>
        v === null ? <Tag>Puanlanmadı</Tag> : <Progress percent={v} size="small" format={(p) => p} />,
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={WORKOUT_ATTRIBUTE_TYPE.map((type) => ({ type, score: values[type] }))}
      rowKey="type"
      size="small"
      loading={loading}
      pagination={false}
    />
  );
}
