import React, { useEffect } from "react";
import { Form, Input, Select, Switch } from "antd";
import { FormDrawer } from "../../../components/admin";

export default function RewardFormDrawer({ open, reward, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(reward);

  useEffect(() => {
    if (open) form.setFieldsValue(reward ?? { rewardType: "points", isActive: true });
  }, [open, reward, form]);

  const handleSubmit = () => form.validateFields().then(onSubmit);

  return (
    <FormDrawer
      open={open}
      title={isEdit ? `"${reward?.title}" Ödülünü Düzenle` : "Ödül Oluştur"}
      submitText={isEdit ? "Değişiklikleri Kaydet" : "Ödül Oluştur"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="Başlık" rules={[{ required: true, min: 2, max: 200 }]}>
          <Input placeholder="örn. 1 Ay Ücretsiz Plus" />
        </Form.Item>
        <Form.Item name="description" label="Açıklama" rules={[{ max: 2000 }]}>
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item name="rewardType" label="Ödül Türü" rules={[{ required: true, max: 50 }]}>
          <Select
            options={[
              { value: "subscription", label: "Abonelik" },
              { value: "physical", label: "Fiziksel Ürün" },
              { value: "points", label: "Bonus Puan" },
              { value: "service", label: "Hizmet" },
            ]}
          />
        </Form.Item>
        <Form.Item name="value" label="Değer" rules={[{ max: 500 }]}>
          <Input placeholder="İsteğe bağlı, örn. 500 veya plus_monthly:1" />
        </Form.Item>
        <Form.Item name="imageUrl" label="Görsel URL" rules={[{ type: "url" }]}>
          <Input placeholder="https://..." />
        </Form.Item>
        <Form.Item name="isActive" label="Aktif" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
