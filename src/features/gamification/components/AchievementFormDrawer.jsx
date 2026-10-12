import React, { useEffect } from "react";
import { Form, Input, InputNumber, Select, Switch, Space } from "antd";
import { FormDrawer } from "../../../components/admin";
import { ACHIEVEMENT_CONDITION_TYPE_LABELS } from "../services/gamificationService";

export default function AchievementFormDrawer({ open, achievement, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(achievement);

  useEffect(() => {
    if (open) form.setFieldsValue(achievement ?? { points: 10, isActive: true });
  }, [open, achievement, form]);

  const handleSubmit = () => form.validateFields().then(onSubmit);

  return (
    <FormDrawer
      open={open}
      title={isEdit ? `"${achievement?.title}" Başarısını Düzenle` : "Başarı Oluştur"}
      submitText={isEdit ? "Değişiklikleri Kaydet" : "Başarı Oluştur"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="Başlık" rules={[{ required: true, min: 2, max: 200 }]}>
          <Input placeholder="örn. 7 Günlük Seri" />
        </Form.Item>
        <Form.Item
          name="code"
          label="Kod"
          rules={[
            { required: true, min: 2, max: 100 },
            { pattern: /^[A-Z0-9_]+$/, message: "Yalnızca büyük harf, rakam ve alt çizgi kullanılabilir" },
          ]}
        >
          <Input placeholder="örn. STREAK_7" />
        </Form.Item>
        <Form.Item name="description" label="Açıklama" rules={[{ max: 1000 }]}>
          <Input.TextArea rows={2} />
        </Form.Item>
        <Space size={16} style={{ width: "100%" }}>
          <Form.Item name="icon" label="Simge (emoji)" rules={[{ max: 500 }]} style={{ flex: 1 }}>
            <Input placeholder="🔥" />
          </Form.Item>
          <Form.Item name="points" label="Puan" rules={[{ required: true, type: "number", min: 0, max: 100000 }]} style={{ flex: 1 }}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Space>
        <Space size={16} style={{ width: "100%" }}>
          <Form.Item name="conditionType" label="Koşul Türü" rules={[{ required: true, max: 100 }]} style={{ flex: 1, minWidth: 220 }}>
            <Select
              placeholder="Koşul seçin"
              options={Object.entries(ACHIEVEMENT_CONDITION_TYPE_LABELS).map(([value, label]) => ({ value, label }))}
            />
          </Form.Item>
          <Form.Item
            name="conditionValue"
            label="Koşul Değeri"
            tooltip="Kullanıcı bu sayıya ulaştığında başarıyı ve puanını otomatik kazanır."
            rules={[{ required: true, max: 200 }, { pattern: /^\d+$/, message: "Pozitif bir tam sayı girin" }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="örn. 7" />
          </Form.Item>
        </Space>
        <Form.Item name="isActive" label="Aktif" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
