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
      title={isEdit ? `Düzenle: ${category?.name}` : "Kategori Oluştur"}
      submitText={isEdit ? "Değişiklikleri Kaydet" : "Kategori Oluştur"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Ad" rules={[{ required: true, min: 2, max: 150 }]}>
          <Input placeholder="örn. Başlarken" />
        </Form.Item>
        <Form.Item name="sortOrder" label="Sıra" rules={[{ required: true, type: "number", min: 0, max: 10000 }]}>
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
