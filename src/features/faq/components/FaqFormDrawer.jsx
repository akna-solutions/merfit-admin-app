import React, { useEffect } from "react";
import { Form, Input, Select, InputNumber, Switch } from "antd";
import { FormDrawer } from "../../../components/admin";

export default function FaqFormDrawer({ open, faq, categories, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(faq);

  useEffect(() => {
    if (open) form.setFieldsValue(faq ?? { sortOrder: 0, isActive: true });
  }, [open, faq, form]);

  const handleSubmit = () => form.validateFields().then(onSubmit);

  return (
    <FormDrawer
      open={open}
      title={isEdit ? "SSS'yi Düzenle" : "SSS Oluştur"}
      submitText={isEdit ? "Değişiklikleri Kaydet" : "SSS Oluştur"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="categoryId" label="Kategori" rules={[{ required: true, message: "Kategori zorunludur" }]}>
          <Select options={categories.map((c) => ({ value: c.id, label: c.name }))} placeholder="Kategori seçin" />
        </Form.Item>
        <Form.Item name="question" label="Soru" rules={[{ required: true, min: 2, max: 500 }]}>
          <Input placeholder="örn. Aboneliğimi nasıl iptal ederim?" />
        </Form.Item>
        <Form.Item name="answer" label="Cevap" rules={[{ required: true, min: 2, max: 4000 }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="sortOrder" label="Sıra" rules={[{ required: true, type: "number", min: 0, max: 10000 }]}>
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
        <Form.Item name="isActive" label="Aktif" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
