import React, { useEffect, useState } from "react";
import {
  Descriptions, Tag, Spin, Empty, Form, Select, InputNumber, Button, Space, Typography, App,
} from "antd";
import { PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { DetailDrawer, StatusTag } from "../../../components/admin";
import { workoutPlanService, workoutService } from "../services/workoutService";
import { fitnessGoalLabel } from "../data/enumLabels";
import { TRAINING_DAYS } from "../../../constants/apiEnums";

const { Text } = Typography;

// Days editor for a plan — mirrors the real API's replace-all endpoint
// (PUT /api/admin/workout-plans/{id}/days), the same pattern the Workout
// form already uses for its exercises editor.
function DaysEditor({ planId }) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [workoutOptions, setWorkoutOptions] = useState([]);

  // Exercise counts come from the server per saved day; a changed row shows
  // its new count only after save, when the API returns the rebuilt days.
  const setDays = (days) => form.setFieldsValue({ days: days ?? [] });

  useEffect(() => {
    if (!planId) return;
    setLoading(true);
    Promise.all([
      workoutPlanService.getDays(planId),
      workoutService.getWorkouts({ pageSize: 200 }),
    ]).then(([daysRes, workoutsRes]) => {
      setDays(daysRes.data);
      setWorkoutOptions(workoutsRes.data.items);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);

  const handleSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      const days = (values.days ?? []).map((d, i) => ({
        workoutId: d.workoutId,
        dayOfWeek: d.dayOfWeek,
        order: d.order ?? i + 1,
      }));
      const res = await workoutPlanService.setDays(planId, { days });
      if (Array.isArray(res?.data)) setDays(res.data);
      message.success("Plan günleri kaydedildi.");
    } catch (err) {
      message.error(err.message || "Plan günleri kaydedilemedi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spin />;

  return (
    <Form form={form} layout="vertical">
      <Form.List name="days">
        {(fields, { add, remove }) => (
          <>
            {fields.length === 0 && <Empty description="Henüz gün yok." style={{ marginBottom: 12 }} />}
            <Space direction="vertical" style={{ width: "100%" }} size={8}>
              {fields.map((field, index) => (
                <Space key={field.key} align="baseline" style={{ width: "100%" }} wrap>
                  <Text type="secondary" style={{ width: 20 }}>{index + 1}.</Text>
                  <Form.Item
                    name={[field.name, "workoutId"]}
                    rules={[{ required: true, message: "Zorunlu alan" }]}
                    style={{ marginBottom: 0, minWidth: 220 }}
                  >
                    <Select
                      placeholder="Antrenman"
                      showSearch
                      optionFilterProp="label"
                      options={workoutOptions.map((w) => ({ value: w.id, label: w.title }))}
                      onChange={() => form.setFieldValue(["days", field.name, "exerciseCount"], undefined)}
                    />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, "dayOfWeek"]}
                    dependencies={fields.filter((f) => f.key !== field.key).map((f) => ["days", f.name, "dayOfWeek"])}
                    rules={[
                      { required: true, message: "Gün seçin" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const all = (getFieldValue("days") ?? []).map((d) => d?.dayOfWeek);
                          return value && all.filter((v) => v === value).length > 1
                            ? Promise.reject(new Error("Bu gün zaten kullanılıyor"))
                            : Promise.resolve();
                        },
                      }),
                    ]}
                    style={{ marginBottom: 0, minWidth: 140 }}
                  >
                    <Select
                      placeholder="Gün"
                      options={TRAINING_DAYS.map((d) => ({ value: d.value, label: d.label }))}
                    />
                  </Form.Item>
                  <Form.Item name={[field.name, "order"]} style={{ marginBottom: 0 }} initialValue={index}>
                    <InputNumber min={0} max={400} addonBefore="Sıra" style={{ width: 140 }} />
                  </Form.Item>
                  <Form.Item noStyle shouldUpdate>
                    {({ getFieldValue }) => {
                      const count = getFieldValue(["days", field.name, "exerciseCount"]);
                      return count == null ? null : <Tag>{count} egzersiz</Tag>;
                    }}
                  </Form.Item>
                  <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(field.name)} />
                </Space>
              ))}
            </Space>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => {
                const used = new Set((form.getFieldValue("days") ?? []).map((d) => d?.dayOfWeek));
                add({ order: fields.length, dayOfWeek: TRAINING_DAYS.find((d) => !used.has(d.value))?.value });
              }}
              disabled={fields.length >= TRAINING_DAYS.length}
              style={{ marginTop: 12 }}
              block
            >
              Gün Ekle
            </Button>
          </>
        )}
      </Form.List>
      <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving} style={{ marginTop: 16 }}>
        Günleri Kaydet
      </Button>
    </Form>
  );
}

export default function WorkoutPlanDetailDrawer({ open, plan, loading, onClose }) {
  return (
    <DetailDrawer open={open} title={plan ? plan.name : "Plan Detayları"} width={620} onClose={onClose}>
      {loading || !plan ? (
        <Spin />
      ) : (
        <>
          <Descriptions column={1} bordered size="small" style={{ marginBottom: 24 }}>
            <Descriptions.Item label="Kullanıcı">{plan.userEmail}</Descriptions.Item>
            <Descriptions.Item label="Hedef">{plan.goal ? fitnessGoalLabel(plan.goal) : <Text type="secondary">—</Text>}</Descriptions.Item>
            <Descriptions.Item label="Açıklama">
              {plan.description || <Text type="secondary">—</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="Başlangıç Tarihi">{dayjs(plan.startDate).format("DD MMM YYYY")}</Descriptions.Item>
            <Descriptions.Item label="Bitiş Tarihi">
              {plan.endDate ? dayjs(plan.endDate).format("DD MMM YYYY") : <Text type="secondary">—</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="Kaynak">
              {plan.isAiGenerated ? <Tag color="purple">Yapay Zeka ile Oluşturuldu</Tag> : <Tag>Manuel</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="Durum">
              <StatusTag status={plan.isActive ? "Active" : "Inactive"}>{plan.isActive ? "Aktif" : "Pasif"}</StatusTag>
            </Descriptions.Item>
            <Descriptions.Item label="Oluşturulma Tarihi">{dayjs(plan.createdAt).format("DD MMM YYYY")}</Descriptions.Item>
          </Descriptions>

          <Text strong>Plan Günleri</Text>
          <div style={{ marginTop: 12 }}>
            <DaysEditor planId={plan.id} />
          </div>
        </>
      )}
    </DetailDrawer>
  );
}
