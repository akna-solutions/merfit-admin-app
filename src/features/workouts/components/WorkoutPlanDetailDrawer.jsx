import React, { useEffect, useState } from "react";
import {
  Descriptions, Tag, Spin, Empty, Form, Select, InputNumber, Button, Space, Typography, App,
} from "antd";
import { PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { DetailDrawer, StatusTag } from "../../../components/admin";
import { workoutPlanService, workoutService } from "../services/workoutService";
import { fitnessGoalLabel } from "../data/enumLabels";

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

  useEffect(() => {
    if (!planId) return;
    setLoading(true);
    Promise.all([
      workoutPlanService.getDays(planId),
      workoutService.getWorkouts({ pageSize: 200 }),
    ]).then(([daysRes, workoutsRes]) => {
      form.setFieldsValue({ days: daysRes.data });
      setWorkoutOptions(workoutsRes.data.items);
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId]);

  const handleSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      const days = values.days.map((d, i) => ({ ...d, order: d.order ?? i + 1 }));
      await workoutPlanService.setDays(planId, { days });
      message.success("Plan günleri kaydedildi.");
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
                    />
                  </Form.Item>
                  <Form.Item name={[field.name, "order"]} style={{ marginBottom: 0 }} initialValue={index}>
                    <InputNumber min={0} max={400} addonBefore="Sıra" style={{ width: 140 }} />
                  </Form.Item>
                  <Button type="text" danger icon={<DeleteOutlined />} onClick={() => remove(field.name)} />
                </Space>
              ))}
            </Space>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => add({ order: fields.length })}
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
