import React, { useEffect } from "react";
import { Form, Input, Switch } from "antd";
import { FormDrawer } from "../../../components/admin";

export default function WorkoutCategoryFormDrawer({ open, category, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(category);

  useEffect(() => {
    if (open) form.setFieldsValue(category ?? { isActive: true });
  }, [open, category, form]);

  const handleSubmit = () => form.validateFields().then(onSubmit);

  return (
    <FormDrawer
      open={open}
      title={isEdit ? `Edit ${category?.name}` : "Create Category"}
      submitText={isEdit ? "Save Changes" : "Create Category"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true, min: 2, max: 150 }]}>
          <Input placeholder="e.g. Strength Training" />
        </Form.Item>
        <Form.Item
          name="slug"
          label="Slug"
          rules={[
            { required: true, min: 2, max: 150 },
            { pattern: /^[a-z0-9]+(-[a-z0-9]+)*$/, message: "Lowercase letters, numbers and hyphens only" },
          ]}
        >
          <Input placeholder="e.g. strength-training" />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ max: 2000 }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="imageUrl" label="Image URL" rules={[{ type: "url", message: "Enter a valid URL" }]}>
          <Input placeholder="https://..." />
        </Form.Item>
        <Form.Item name="isActive" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
