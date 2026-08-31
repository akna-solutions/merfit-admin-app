import React, { useEffect } from "react";
import { Form, Input } from "antd";
import { FormDrawer } from "../../../components/admin";

export default function EquipmentFormDrawer({ open, equipment, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(equipment);

  useEffect(() => {
    if (open) form.setFieldsValue(equipment ?? {});
  }, [open, equipment, form]);

  const handleSubmit = () => form.validateFields().then(onSubmit);

  return (
    <FormDrawer
      open={open}
      title={isEdit ? `Edit ${equipment?.name}` : "Create Equipment"}
      submitText={isEdit ? "Save Changes" : "Create Equipment"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true, min: 2, max: 150 }]}>
          <Input placeholder="e.g. Dumbbell" />
        </Form.Item>
        <Form.Item
          name="slug"
          label="Slug"
          rules={[
            { required: true, min: 2, max: 150 },
            { pattern: /^[a-z0-9]+(-[a-z0-9]+)*$/, message: "Lowercase letters, numbers and hyphens only" },
          ]}
        >
          <Input placeholder="e.g. dumbbell" />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
