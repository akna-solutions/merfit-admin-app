import React, { useEffect, useState } from "react";
import {
  Descriptions, Tag, Spin, Empty, Form, Select, InputNumber, Button, Space, Typography, App,
} from "antd";
import { PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { DetailDrawer, StatusTag } from "../../../components/admin";
import { workoutPlanService, workoutService } from "../services/workoutService";

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
      message.success("Plan days saved.");
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
            {fields.length === 0 && <Empty description="No days yet." style={{ marginBottom: 12 }} />}
            <Space direction="vertical" style={{ width: "100%" }} size={8}>
              {fields.map((field, index) => (
                <Space key={field.key} align="baseline" style={{ width: "100%" }} wrap>
                  <Text type="secondary" style={{ width: 20 }}>{index + 1}.</Text>
                  <Form.Item
                    name={[field.name, "workoutId"]}
                    rules={[{ required: true, message: "Required" }]}
                    style={{ marginBottom: 0, minWidth: 220 }}
                  >
                    <Select
                      placeholder="Workout"
                      showSearch
                      optionFilterProp="label"
                      options={workoutOptions.map((w) => ({ value: w.id, label: w.title }))}
                    />
                  </Form.Item>
                  <Form.Item name={[field.name, "order"]} style={{ marginBottom: 0 }} initialValue={index}>
                    <InputNumber min={0} max={400} addonBefore="Order" style={{ width: 140 }} />
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
              Add Day
            </Button>
          </>
        )}
      </Form.List>
      <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving} style={{ marginTop: 16 }}>
        Save Days
      </Button>
    </Form>
  );
}

export default function WorkoutPlanDetailDrawer({ open, plan, loading, onClose }) {
  return (
    <DetailDrawer open={open} title={plan ? plan.name : "Plan Details"} width={620} onClose={onClose}>
      {loading || !plan ? (
        <Spin />
      ) : (
        <>
          <Descriptions column={1} bordered size="small" style={{ marginBottom: 24 }}>
            <Descriptions.Item label="User">{plan.userEmail}</Descriptions.Item>
            <Descriptions.Item label="Goal">{plan.goal ?? <Text type="secondary">—</Text>}</Descriptions.Item>
            <Descriptions.Item label="Description">
              {plan.description || <Text type="secondary">—</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="Start Date">{dayjs(plan.startDate).format("DD MMM YYYY")}</Descriptions.Item>
            <Descriptions.Item label="End Date">
              {plan.endDate ? dayjs(plan.endDate).format("DD MMM YYYY") : <Text type="secondary">—</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="Source">
              {plan.isAiGenerated ? <Tag color="purple">AI Generated</Tag> : <Tag>Manual</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <StatusTag status={plan.isActive ? "Active" : "Inactive"} />
            </Descriptions.Item>
            <Descriptions.Item label="Created At">{dayjs(plan.createdAt).format("DD MMM YYYY")}</Descriptions.Item>
          </Descriptions>

          <Text strong>Plan Days</Text>
          <div style={{ marginTop: 12 }}>
            <DaysEditor planId={plan.id} />
          </div>
        </>
      )}
    </DetailDrawer>
  );
}
