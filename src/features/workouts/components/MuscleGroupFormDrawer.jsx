import React, { useEffect } from "react";
import { Form, Input } from "antd";
import { FormDrawer } from "../../../components/admin";

export default function MuscleGroupFormDrawer({ open, muscleGroup, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(muscleGroup);

  useEffect(() => {
    if (open) form.setFieldsValue(muscleGroup ?? {});
  }, [open, muscleGroup, form]);

  const handleSubmit = () => form.validateFields().then(onSubmit);

  return (
    <FormDrawer
      open={open}
      title={isEdit ? `"${muscleGroup?.name}" Düzenle` : "Kas Grubu Oluştur"}
      submitText={isEdit ? "Değişiklikleri Kaydet" : "Kas Grubu Oluştur"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Ad" rules={[{ required: true, min: 2, max: 150 }]}>
          <Input placeholder="örn. Göğüs" />
        </Form.Item>
        <Form.Item
          name="slug"
          label="Slug"
          rules={[
            { required: true, min: 2, max: 150 },
            { pattern: /^[a-z0-9]+(-[a-z0-9]+)*$/, message: "Yalnızca küçük harf, rakam ve tire kullanılabilir" },
          ]}
        >
          <Input placeholder="örn. gogus" />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
