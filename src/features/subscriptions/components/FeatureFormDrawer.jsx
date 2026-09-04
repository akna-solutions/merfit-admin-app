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
      title={isEdit ? `${feature?.name} Özelliğini Düzenle` : "Özellik Oluştur"}
      submitText={isEdit ? "Değişiklikleri Kaydet" : "Özellik Oluştur"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="code"
          label="Kod"
          rules={[
            { required: true, min: 2, max: 100 },
            { pattern: /^[A-Z0-9_]+$/, message: "Sadece büyük harf, rakam ve alt çizgi kullanılabilir" },
          ]}
        >
          <Input placeholder="örn. AI_WORKOUT_PLANS" />
        </Form.Item>
        <Form.Item name="name" label="İsim" rules={[{ required: true, min: 2, max: 200 }]}>
          <Input placeholder="örn. Yapay Zeka Destekli Antrenman Planları" />
        </Form.Item>
        <Form.Item name="description" label="Açıklama" rules={[{ max: 1000 }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
