import React, { useEffect } from "react";
import { Form, Input } from "antd";
import { FormDrawer } from "../../../components/admin";

export default function FeatureFormDrawer({ open, feature, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(feature);

  useEffect(() => {
    if (open) form.setFieldsValue(feature ?? {});
  }, [open, feature, form]);

  const handleSubmit = () => form.validateFields().then(onSubmit);

  return (
    <FormDrawer
      open={open}
      title={isEdit ? `Edit ${feature?.name}` : "Create Feature"}
      submitText={isEdit ? "Save Changes" : "Create Feature"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="code"
          label="Code"
          rules={[
            { required: true, min: 2, max: 100 },
            { pattern: /^[A-Z0-9_]+$/, message: "Uppercase letters, numbers and underscores only" },
          ]}
        >
          <Input placeholder="e.g. AI_WORKOUT_PLANS" />
        </Form.Item>
        <Form.Item name="name" label="Name" rules={[{ required: true, min: 2, max: 200 }]}>
          <Input placeholder="e.g. AI-Generated Workout Plans" />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ max: 1000 }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
