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
      title={isEdit ? `${language?.name} Dilini Düzenle` : "Dil Ekle"}
      submitText={isEdit ? "Değişiklikleri Kaydet" : "Dil Ekle"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="code"
          label="Kod"
          rules={[{ required: true, min: 2, max: 10 }]}
        >
          <Input placeholder="örn. tr, en, en-US" />
        </Form.Item>
        <Form.Item name="name" label="Ad" rules={[{ required: true, min: 2, max: 100 }]}>
          <Input placeholder="örn. Türkçe" />
        </Form.Item>
        <Form.Item
          name="isDefault"
          label="Varsayılan Dil"
          valuePropName="checked"
          extra="Bunu varsayılan olarak ayarlamak, başka bir varsayılan dili otomatik olarak kaldırır."
        >
          <Switch />
        </Form.Item>
        <Form.Item name="isActive" label="Aktif" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
