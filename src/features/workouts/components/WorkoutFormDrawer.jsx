import React, { useEffect, useState } from "react";
import {
  Form, Input, InputNumber, Select, Switch, Divider, Button, Space,
  Typography, Empty, App,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { FormDrawer } from "../../../components/admin";
import { DIFFICULTY_LEVEL } from "../../../constants/apiEnums";
import { workoutService } from "../services/workoutService";
import { difficultyLabel } from "../data/enumLabels";

const { Text } = Typography;

// Exercises are managed through a *separate* replace-all endpoint in the
// real API (PUT /api/admin/workouts/{id}/exercises — see
// AdminWorkoutController.SetExercises), so they get their own "Save
// Exercises" action here rather than being bundled into the workout
// upsert payload. That also means a brand-new (unsaved) workout has
// nowhere to attach exercises to yet.
function ExercisesEditor({ workoutId, exerciseOptions }) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!workoutId) return;
    setLoading(true);
    workoutService.getExercises(workoutId).then((res) => {
      form.setFieldsValue({ exercises: res.data });
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workoutId]);

  const handleSave = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      const exercises = values.exercises.map((ex, i) => ({
        ...ex,
        order: i + 1,
        exerciseName: exerciseOptions.find((o) => o.id === ex.exerciseId)?.name ?? "",
      }));
      await workoutService.setExercises(workoutId, { exercises });
      message.success("Egzersizler kaydedildi.");
    } finally {
      setSaving(false);
    }
  };

  if (!workoutId) {
    return <Empty description="Egzersiz eklemek için önce antrenmanı kaydedin." />;
  }

  return (
    <Form form={form} layout="vertical" disabled={loading}>
      <Form.List name="exercises">
        {(fields, { add, remove }) => (
          <>
            {fields.length === 0 && !loading && (
              <Empty description="Henüz egzersiz yok." style={{ marginBottom: 12 }} />
            )}
            <Space direction="vertical" style={{ width: "100%" }} size={8}>
              {fields.map((field, index) => (
                <Space key={field.key} align="baseline" style={{ width: "100%" }} wrap>
                  <Text type="secondary" style={{ width: 20 }}>{index + 1}.</Text>
                  <Form.Item
                    name={[field.name, "exerciseId"]}
                    rules={[{ required: true, message: "Zorunlu alan" }]}
                    style={{ marginBottom: 0, minWidth: 180 }}
                  >
                    <Select
                      placeholder="Egzersiz"
                      options={exerciseOptions.map((o) => ({ value: o.id, label: o.name }))}
                      showSearch
                      optionFilterProp="label"
                    />
                  </Form.Item>
                  <Form.Item name={[field.name, "sets"]} style={{ marginBottom: 0 }} initialValue={3}>
                    <InputNumber min={1} max={50} addonBefore="Set" style={{ width: 120 }} />
                  </Form.Item>
                  <Form.Item name={[field.name, "reps"]} style={{ marginBottom: 0 }} initialValue={10}>
                    <InputNumber min={1} max={500} addonBefore="Tekrar" style={{ width: 120 }} />
                  </Form.Item>
                  <Form.Item name={[field.name, "restSeconds"]} style={{ marginBottom: 0 }} initialValue={45}>
                    <InputNumber min={0} max={1800} addonBefore="Dinlenme sn" style={{ width: 130 }} />
                  </Form.Item>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => remove(field.name)}
                  />
                </Space>
              ))}
            </Space>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => add({ sets: 3, reps: 10, restSeconds: 45 })}
              style={{ marginTop: 12 }}
              block
            >
              Add Exercise
            </Button>
          </>
        )}
      </Form.List>
      <Button type="primary" onClick={handleSave} loading={saving} style={{ marginTop: 16 }}>
        Save Exercises
      </Button>
    </Form>
  );
}

export default function WorkoutFormDrawer({
  open, workout, categories, muscleGroups, exerciseOptions, submitting, onClose, onSubmit,
}) {
  const [form] = Form.useForm();
  const isEdit = Boolean(workout);

  useEffect(() => {
    if (open) {
      form.setFieldsValue(
        workout ?? { durationMin: 30, difficulty: "Beginner", isFeatured: false, isPremium: false, isActive: true },
      );
    }
  }, [open, workout, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => onSubmit(values));
  };

  return (
    <FormDrawer
      open={open}
      title={isEdit ? `Edit ${workout?.title}` : "Create Workout"}
      submitText={isEdit ? "Save Changes" : "Create Workout"}
      submitting={submitting}
      width={640}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, min: 2, max: 200, message: "2-200 characters required" }]}
        >
          <Input placeholder="e.g. Full Body Burn" />
        </Form.Item>
        <Form.Item
          name="slug"
          label="Slug"
          rules={[
            { required: true, min: 2, max: 200, message: "2-200 characters required" },
            { pattern: /^[a-z0-9]+(-[a-z0-9]+)*$/, message: "Lowercase letters, numbers and hyphens only" },
          ]}
        >
          <Input placeholder="e.g. full-body-burn" />
        </Form.Item>
        <Form.Item name="tagline" label="Tagline" rules={[{ max: 300 }]}>
          <Input placeholder="Short one-line summary" />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ max: 4000 }]}>
          <Input.TextArea rows={3} placeholder="Full workout description" />
        </Form.Item>
        <Space size={16} style={{ width: "100%" }}>
          <Form.Item
            name="durationMin"
            label="Duration (min)"
            rules={[{ required: true, type: "number", min: 1, max: 600 }]}
            style={{ flex: 1 }}
          >
            <InputNumber style={{ width: "100%" }} min={1} max={600} />
          </Form.Item>
          <Form.Item
            name="difficulty"
            label="Difficulty"
            rules={[{ required: true }]}
            style={{ flex: 1 }}
          >
            <Select options={DIFFICULTY_LEVEL.map((d) => ({ value: d, label: d }))} />
          </Form.Item>
        </Space>
        <Space size={16} style={{ width: "100%" }}>
          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Category is required" }]}
            style={{ flex: 1 }}
          >
            <Select
              placeholder="Select category"
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />
          </Form.Item>
          <Form.Item name="muscleGroupId" label="Muscle Group" style={{ flex: 1 }}>
            <Select
              placeholder="Select muscle group"
              allowClear
              options={muscleGroups.map((m) => ({ value: m.id, label: m.name }))}
            />
          </Form.Item>
        </Space>
        <Form.Item
          name="imageUrl"
          label="Image URL"
          rules={[{ type: "url", message: "Enter a valid URL" }]}
        >
          <Input placeholder="https://..." />
        </Form.Item>
        <Space size={32}>
          <Form.Item name="isFeatured" label="Featured" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="isPremium" label="Premium" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Space>
      </Form>

      <Divider>Exercises</Divider>
      <ExercisesEditor workoutId={workout?.id} exerciseOptions={exerciseOptions} />
    </FormDrawer>
  );
}
