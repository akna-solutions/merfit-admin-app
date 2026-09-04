import React, { useEffect } from "react";
import { Form, Input, InputNumber, Select, Switch, Space } from "antd";
import { FormDrawer } from "../../../components/admin";
import { DIFFICULTY_LEVEL } from "../../../constants/apiEnums";
import { difficultyLabel } from "../data/enumLabels";

export default function ExerciseFormDrawer({ open, exercise, muscleGroups, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(exercise);

  useEffect(() => {
    if (open) {
      form.setFieldsValue(
        exercise ?? { difficulty: "Beginner", isActive: true },
      );
    }
  }, [open, exercise, form]);

  const handleSubmit = () => form.validateFields().then(onSubmit);

  return (
    <FormDrawer
      open={open}
      title={isEdit ? `"${exercise?.name}" Düzenle` : "Egzersiz Oluştur"}
      submitText={isEdit ? "Değişiklikleri Kaydet" : "Egzersiz Oluştur"}
      submitting={submitting}
      width={560}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Ad" rules={[{ required: true, min: 2, max: 200 }]}>
          <Input placeholder="örn. Bench Press" />
        </Form.Item>
        <Form.Item
          name="slug"
          label="Slug"
          rules={[
            { required: true, min: 2, max: 200 },
            { pattern: /^[a-z0-9]+(-[a-z0-9]+)*$/, message: "Yalnızca küçük harf, rakam ve tire kullanılabilir" },
          ]}
        >
          <Input placeholder="örn. bench-press" />
        </Form.Item>
        <Form.Item name="description" label="Açıklama" rules={[{ max: 4000 }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="instructions" label="Talimatlar" rules={[{ max: 8000 }]}>
          <Input.TextArea rows={4} placeholder="Bu egzersizin adım adım nasıl yapılacağı" />
        </Form.Item>
        <Space size={16} style={{ width: "100%" }}>
          <Form.Item name="difficulty" label="Zorluk" rules={[{ required: true }]} style={{ flex: 1 }}>
            <Select options={DIFFICULTY_LEVEL.map((d) => ({ value: d, label: difficultyLabel(d) }))} />
          </Form.Item>
          <Form.Item
            name="primaryMuscleGroupId"
            label="Birincil Kas Grubu"
            rules={[{ required: true, message: "Kas grubu zorunludur" }]}
            style={{ flex: 1 }}
          >
            <Select
              placeholder="Kas grubu seçin"
              showSearch
              optionFilterProp="label"
              options={muscleGroups.map((m) => ({ value: m.id, label: m.name }))}
            />
          </Form.Item>
        </Space>
        <Form.Item name="equipmentType" label="Ekipman Türü" rules={[{ max: 200 }]}>
          <Input placeholder="örn. Halter" />
        </Form.Item>
        <Space size={16} style={{ width: "100%" }}>
          <Form.Item
            name="caloriesPerMinute"
            label="Kalori / Dakika"
            rules={[{ type: "number", min: 0, max: 100 }]}
            style={{ flex: 1 }}
          >
            <InputNumber style={{ width: "100%" }} min={0} max={100} step={0.1} />
          </Form.Item>
          <Form.Item name="isActive" label="Aktif" valuePropName="checked" style={{ flex: 1 }}>
            <Switch />
          </Form.Item>
        </Space>
        <Form.Item name="imageUrl" label="Görsel URL" rules={[{ type: "url", message: "Geçerli bir URL girin" }]}>
          <Input placeholder="https://..." />
        </Form.Item>
        <Form.Item name="videoUrl" label="Video URL" rules={[{ type: "url", message: "Geçerli bir URL girin" }]}>
          <Input placeholder="https://..." />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
