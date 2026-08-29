import React, { useEffect } from "react";
import { Form, Input, InputNumber } from "antd";
import { FormDrawer } from "../../../components/admin";

export default function CategoryFormDrawer({ open, category, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(category);

  useEffect(() => {
    if (open) form.setFieldsValue(category ?? { sortOrder: 0 });
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
          <Input placeholder="e.g. Getting Started" />
        </Form.Item>
        <Form.Item name="sortOrder" label="Sort Order" rules={[{ required: true, type: "number", min: 0, max: 10000 }]}>
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
