import React, { useMemo, useState } from "react";
import { App, Button, Col, Form, Input, Radio, Row, Select, Space, Typography } from "antd";
import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { SectionCard } from "../../../components/admin";
import { workoutLabService } from "../services/workoutLabService";
import { DAY_LABELS, RATING_LABELS, RATING_ORDER } from "../utils/labLabels";

const { Text } = Typography;
const MAX_PROBLEM_ITEMS = 50;

const emptyItem = () => ({ dayOfWeek: undefined, exerciseId: undefined, exerciseName: undefined, note: "" });

function initialState(evaluation) {
  return {
    rating: evaluation?.rating,
    missingPoints: evaluation?.missingPoints ?? "",
    problemItems: (evaluation?.problemItems ?? []).map((p) => ({ ...p, note: p.note ?? "" })),
    exerciseSuggestions: evaluation?.exerciseSuggestions ?? "",
    comment: evaluation?.comment ?? "",
  };
}

const textOrNull = (v) => (v && v.trim() ? v.trim() : null);

/** Değerlendirme formu: puan + eksikler + sorunlu gün/egzersizler + öneriler + genel yorum. */
export function toEvaluationRequest(state) {
  return {
    rating: state.rating,
    missingPoints: textOrNull(state.missingPoints),
    problemItems: state.problemItems
      .filter((p) => p.dayOfWeek)
      .map((p) => ({
        dayOfWeek: p.dayOfWeek,
        exerciseId: p.exerciseId ?? null,
        exerciseName: p.exerciseName ?? null,
        note: textOrNull(p.note),
      })),
    exerciseSuggestions: textOrNull(state.exerciseSuggestions),
    comment: textOrNull(state.comment),
  };
}

export default function EvaluationForm({ simulation, onSaved }) {
  const { message } = App.useApp();
  const [state, setState] = useState(() => initialState(simulation?.evaluation));
  const [saving, setSaving] = useState(false);
  const [ratingError, setRatingError] = useState(null);
  const days = useMemo(() => simulation?.result?.days ?? [], [simulation]);

  const exerciseOptions = (dayOfWeek) => {
    const day = days.find((d) => d.dayOfWeek === dayOfWeek);
    if (!day) return [];
    return [...(day.exercises ?? []), ...(day.cardioExercises ?? [])].map((e) => ({
      value: e.exerciseId,
      label: `${e.order}. ${e.name}${e.kind === "Cardio" ? " (kardiyo)" : ""}`,
      name: e.name,
    }));
  };

  const updateItem = (index, patch) =>
    setState((prev) => ({
      ...prev,
      problemItems: prev.problemItems.map((p, i) => (i === index ? { ...p, ...patch } : p)),
    }));

  const handleSave = async () => {
    if (!state.rating) {
      setRatingError("Bir değerlendirme seçin.");
      return;
    }
    setSaving(true);
    try {
      const response = await workoutLabService.evaluate(simulation.id, toEvaluationRequest(state));
      message.success("Değerlendirme kaydedildi.");
      onSaved?.(response.data);
    } catch (e) {
      message.error(e?.message || "Değerlendirme kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  const ev = simulation?.evaluation;

  return (
    <SectionCard
      title="Değerlendirme"
      extra={
        ev?.evaluatedAt && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            Son kayıt {dayjs(ev.evaluatedAt).format("DD MMM YYYY HH:mm")}
            {ev.evaluatedByEmail ? ` · ${ev.evaluatedByEmail}` : ""}
          </Text>
        )
      }
    >
      <Form layout="vertical" onFinish={handleSave}>
        <Form.Item label="Program nasıl?" required validateStatus={ratingError ? "error" : undefined} help={ratingError}>
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            value={state.rating}
            onChange={(e) => {
              setRatingError(null);
              setState((prev) => ({ ...prev, rating: e.target.value }));
            }}
            options={RATING_ORDER.map((r) => ({ value: r, label: RATING_LABELS[r] }))}
          />
        </Form.Item>

        <Form.Item label="Eksik noktalar">
          <Input.TextArea
            rows={3}
            maxLength={4000}
            value={state.missingPoints}
            onChange={(e) => setState((prev) => ({ ...prev, missingPoints: e.target.value }))}
            placeholder="Programda eksik gördüğünüz noktalar"
          />
        </Form.Item>

        <Form.Item label="Sorunlu günler / egzersizler">
          <Space orientation="vertical" style={{ width: "100%" }}>
            {state.problemItems.map((item, index) => (
              <Row gutter={8} key={index} align="middle">
                <Col xs={24} sm={6}>
                  <Select
                    placeholder="Gün"
                    style={{ width: "100%" }}
                    value={item.dayOfWeek}
                    options={days.map((d) => ({ value: d.dayOfWeek, label: DAY_LABELS[d.dayOfWeek] ?? d.dayOfWeek }))}
                    onChange={(v) => updateItem(index, { dayOfWeek: v, exerciseId: undefined, exerciseName: undefined })}
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <Select
                    allowClear
                    placeholder="Egzersiz (isteğe bağlı)"
                    style={{ width: "100%" }}
                    disabled={!item.dayOfWeek}
                    value={item.exerciseId ?? undefined}
                    options={exerciseOptions(item.dayOfWeek)}
                    onChange={(v, opt) => updateItem(index, { exerciseId: v ?? undefined, exerciseName: opt?.name })}
                  />
                </Col>
                <Col xs={20} sm={9}>
                  <Input
                    maxLength={1000}
                    placeholder="Not"
                    value={item.note}
                    onChange={(e) => updateItem(index, { note: e.target.value })}
                  />
                </Col>
                <Col xs={4} sm={1}>
                  <Button
                    type="text"
                    danger
                    aria-label="Satırı kaldır"
                    icon={<DeleteOutlined />}
                    onClick={() => setState((prev) => ({ ...prev, problemItems: prev.problemItems.filter((_, i) => i !== index) }))}
                  />
                </Col>
              </Row>
            ))}
            <Button
              icon={<PlusOutlined />}
              disabled={days.length === 0 || state.problemItems.length >= MAX_PROBLEM_ITEMS}
              onClick={() => setState((prev) => ({ ...prev, problemItems: [...prev.problemItems, emptyItem()] }))}
            >
              Sorunlu gün / egzersiz ekle
            </Button>
          </Space>
        </Form.Item>

        <Form.Item label="Eklenmesi gereken egzersiz önerileri">
          <Input.TextArea
            rows={3}
            maxLength={4000}
            value={state.exerciseSuggestions}
            onChange={(e) => setState((prev) => ({ ...prev, exerciseSuggestions: e.target.value }))}
          />
        </Form.Item>

        <Form.Item label="Genel yorum">
          <Input.TextArea
            rows={3}
            maxLength={4000}
            value={state.comment}
            onChange={(e) => setState((prev) => ({ ...prev, comment: e.target.value }))}
          />
        </Form.Item>

        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={saving}>
          Değerlendirmeyi kaydet
        </Button>
      </Form>
    </SectionCard>
  );
}
