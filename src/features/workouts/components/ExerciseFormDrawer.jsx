import React, { useEffect } from "react";
import { Form, Input, InputNumber, Select, Switch, Space } from "antd";
import { FormDrawer } from "../../../components/admin";
import { DIFFICULTY_LEVEL } from "../../../constants/apiEnums";

export default function ExerciseFormDrawer({ open, exercise, muscleGroups, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(exercise);

  useEffect(() => {
    if (open) {
      form.setFieldsValue(
        exercise ?? { difficulty: "Beginner", isActive: true },
      );
    }
  }, [open, exercise, form]);

  const handleSubmit = () => form.validateFields().then(onSubmit);

  return (
    <FormDrawer
      open={open}
      title={isEdit ? `Edit ${exercise?.name}` : "Create Exercise"}
      submitText={isEdit ? "Save Changes" : "Create Exercise"}
      submitting={submitting}
      width={560}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true, min: 2, max: 200 }]}>
          <Input placeholder="e.g. Barbell Bench Press" />
        </Form.Item>
        <Form.Item
          name="slug"
          label="Slug"
          rules={[
            { required: true, min: 2, max: 200 },
            { pattern: /^[a-z0-9]+(-[a-z0-9]+)*$/, message: "Lowercase letters, numbers and hyphens only" },
          ]}
        >
          <Input placeholder="e.g. barbell-bench-press" />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ max: 4000 }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="instructions" label="Instructions" rules={[{ max: 8000 }]}>
          <Input.TextArea rows={4} placeholder="Step-by-step how to perform this exercise" />
        </Form.Item>
        <Space size={16} style={{ width: "100%" }}>
          <Form.Item name="difficulty" label="Difficulty" rules={[{ required: true }]} style={{ flex: 1 }}>
            <Select options={DIFFICULTY_LEVEL.map((d) => ({ value: d, label: d }))} />
          </Form.Item>
          <Form.Item
            name="primaryMuscleGroupId"
            label="Primary Muscle Group"
            rules={[{ required: true, message: "Muscle group is required" }]}
            style={{ flex: 1 }}
          >
            <Select
              placeholder="Select muscle group"
              showSearch
              optionFilterProp="label"
              options={muscleGroups.map((m) => ({ value: m.id, label: m.name }))}
            />
          </Form.Item>
        </Space>
        <Form.Item name="equipmentType" label="Equipment Type" rules={[{ max: 200 }]}>
          <Input placeholder="e.g. Barbell" />
        </Form.Item>
        <Space size={16} style={{ width: "100%" }}>
          <Form.Item
            name="caloriesPerMinute"
            label="Calories / Minute"
            rules={[{ type: "number", min: 0, max: 100 }]}
            style={{ flex: 1 }}
          >
            <InputNumber style={{ width: "100%" }} min={0} max={100} step={0.1} />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked" style={{ flex: 1 }}>
            <Switch />
          </Form.Item>
        </Space>
        <Form.Item name="imageUrl" label="Image URL" rules={[{ type: "url", message: "Enter a valid URL" }]}>
          <Input placeholder="https://..." />
        </Form.Item>
        <Form.Item name="videoUrl" label="Video URL" rules={[{ type: "url", message: "Enter a valid URL" }]}>
          <Input placeholder="https://..." />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
