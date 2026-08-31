import React, { useEffect } from "react";
import { Form, Input, Switch } from "antd";
import { FormDrawer } from "../../../components/admin";

export default function LanguageFormDrawer({ open, language, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(language);

  useEffect(() => {
    if (open) form.setFieldsValue(language ?? { isDefault: false, isActive: true });
  }, [open, language, form]);

  const handleSubmit = () => form.validateFields().then(onSubmit);

  return (
    <FormDrawer
      open={open}
      title={isEdit ? `Edit ${language?.name}` : "Add Language"}
      submitText={isEdit ? "Save Changes" : "Add Language"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="code"
          label="Code"
          rules={[{ required: true, min: 2, max: 10 }]}
        >
          <Input placeholder="e.g. tr, en, en-US" />
        </Form.Item>
        <Form.Item name="name" label="Name" rules={[{ required: true, min: 2, max: 100 }]}>
          <Input placeholder="e.g. Turkish" />
        </Form.Item>
        <Form.Item
          name="isDefault"
          label="Default Language"
          valuePropName="checked"
          extra="Setting this as default automatically unsets any other default language."
        >
          <Switch />
        </Form.Item>
        <Form.Item name="isActive" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
