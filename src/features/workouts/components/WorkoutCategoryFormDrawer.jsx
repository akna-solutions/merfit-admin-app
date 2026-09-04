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
      title={isEdit ? `"${category?.name}" Düzenle` : "Kategori Oluştur"}
      submitText={isEdit ? "Değişiklikleri Kaydet" : "Kategori Oluştur"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Ad" rules={[{ required: true, min: 2, max: 150 }]}>
          <Input placeholder="örn. Kuvvet Antrenmanı" />
        </Form.Item>
        <Form.Item
          name="slug"
          label="Slug"
          rules={[
            { required: true, min: 2, max: 150 },
            { pattern: /^[a-z0-9]+(-[a-z0-9]+)*$/, message: "Yalnızca küçük harf, rakam ve tire kullanılabilir" },
          ]}
        >
          <Input placeholder="örn. kuvvet-antrenmani" />
        </Form.Item>
        <Form.Item name="description" label="Açıklama" rules={[{ max: 2000 }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="imageUrl" label="Görsel URL" rules={[{ type: "url", message: "Geçerli bir URL girin" }]}>
          <Input placeholder="https://..." />
        </Form.Item>
        <Form.Item name="isActive" label="Aktif" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
