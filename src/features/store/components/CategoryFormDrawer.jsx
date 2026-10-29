import React, { useEffect } from "react";
import { Form, Input, InputNumber, Select, Switch } from "antd";
import { FormDrawer, ImageUrlInput } from "../../../components/admin";
import { categoryToFormValues, categoryToPayload, httpsUrlRule } from "../utils/storeForms";

export default function CategoryFormDrawer({ open, item, categories, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(item);

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue(categoryToFormValues(item));
    }
  }, [open, item, form]);

  // Yalnızca iki seviye: üst kategori olarak sadece kök kategoriler seçilebilir (sunucu da aynı kuralı uygular).
  const parentOptions = categories
    .filter((c) => !c.parentCategoryId && c.id !== item?.id)
    .map((c) => ({ value: c.id, label: c.name }));

  const handleSubmit = () => {
    form.validateFields().then((values) => onSubmit(categoryToPayload(values)));
  };

  return (
    <FormDrawer
      open={open}
      title={isEdit ? `Düzenle: ${item?.name}` : "Kategori Ekle"}
      submitText={isEdit ? "Değişiklikleri Kaydet" : "Kategori Ekle"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Ad" rules={[{ required: true, whitespace: true, message: "Kategori adı zorunludur" }, { min: 2, max: 120 }]}>
          <Input maxLength={120} />
        </Form.Item>
        <Form.Item name="slug" label="Slug" extra="Boş bırakılırsa addan üretilir.">
          <Input maxLength={140} />
        </Form.Item>
        <Form.Item name="parentCategoryId" label="Üst kategori" extra="Boşsa ana kategori olur.">
          <Select allowClear options={parentOptions} placeholder="Ana kategori" />
        </Form.Item>
        <Form.Item name="description" label="Açıklama" rules={[{ max: 1000 }]}>
          <Input.TextArea rows={3} maxLength={1000} />
        </Form.Item>
        <Form.Item name="imageUrl" label="Görsel URL" rules={[{ max: 500 }, httpsUrlRule()]}>
          <ImageUrlInput previewAlt="Kategori görseli önizlemesi" />
        </Form.Item>
        <Form.Item name="icon" label="İkon" extra="Görsel yokken mobilde gösterilen Ionicons adı (örn. barbell-outline).">
          <Input maxLength={60} />
        </Form.Item>
        <Form.Item name="sortOrder" label="Sıra">
          <InputNumber min={0} max={10000} precision={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="isActive" label="Aktif" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
