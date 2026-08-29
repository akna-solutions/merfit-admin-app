import React, { useEffect } from "react";
import { Form, Input, InputNumber, Switch, Space } from "antd";
import { FormDrawer } from "../../../components/admin";

export default function AchievementFormDrawer({ open, achievement, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(achievement);

  useEffect(() => {
    if (open) form.setFieldsValue(achievement ?? { points: 10, isActive: true });
  }, [open, achievement, form]);

  const handleSubmit = () => form.validateFields().then(onSubmit);

  return (
    <FormDrawer
      open={open}
      title={isEdit ? `Edit ${achievement?.title}` : "Create Achievement"}
      submitText={isEdit ? "Save Changes" : "Create Achievement"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="Title" rules={[{ required: true, min: 2, max: 200 }]}>
          <Input placeholder="e.g. 7 Day Streak" />
        </Form.Item>
        <Form.Item
          name="code"
          label="Code"
          rules={[
            { required: true, min: 2, max: 100 },
            { pattern: /^[A-Z0-9_]+$/, message: "Uppercase letters, numbers and underscores only" },
          ]}
        >
          <Input placeholder="e.g. STREAK_7" />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ max: 1000 }]}>
          <Input.TextArea rows={2} />
        </Form.Item>
        <Space size={16} style={{ width: "100%" }}>
          <Form.Item name="icon" label="Icon (emoji)" rules={[{ max: 500 }]} style={{ flex: 1 }}>
            <Input placeholder="🔥" />
          </Form.Item>
          <Form.Item name="points" label="Points" rules={[{ required: true, type: "number", min: 0, max: 100000 }]} style={{ flex: 1 }}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Space>
        <Space size={16} style={{ width: "100%" }}>
          <Form.Item name="conditionType" label="Condition Type" rules={[{ required: true, max: 100 }]} style={{ flex: 1 }}>
            <Input placeholder="e.g. streak_days" />
          </Form.Item>
          <Form.Item name="conditionValue" label="Condition Value" rules={[{ required: true, max: 200 }]} style={{ flex: 1 }}>
            <Input placeholder="e.g. 7" />
          </Form.Item>
        </Space>
        <Form.Item name="isActive" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
