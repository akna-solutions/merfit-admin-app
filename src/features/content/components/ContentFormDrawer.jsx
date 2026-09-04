import React, { useEffect } from "react";
import { Form, Input, Select, Switch, DatePicker } from "antd";
import dayjs from "dayjs";
import { FormDrawer } from "../../../components/admin";
import { CONTENT_TYPES } from "../data/contentMockData";

// Kod değerleri API ile birebir eşleşir — yalnızca gösterilen etiketler Türkçeleştirilir.
const CONTENT_TYPE_LABELS = {
  Banner: "Banner",
  Announcement: "Duyuru",
  Campaign: "Kampanya",
  FeatureCard: "Özellik Kartı",
  Promotional: "Promosyon",
};

export default function ContentFormDrawer({ open, item, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(item);

  useEffect(() => {
    if (open) {
      form.setFieldsValue(
        item
          ? {
              ...item,
              dateRange: item.startAt || item.endAt
                ? [item.startAt ? dayjs(item.startAt) : null, item.endAt ? dayjs(item.endAt) : null]
                : undefined,
            }
          : { type: "Banner", isActive: true },
      );
    }
  }, [open, item, form]);

  const handleSubmit = () => {
    form.validateFields().then(({ dateRange, ...rest }) => {
      onSubmit({
        ...rest,
        startAt: dateRange?.[0] ? dateRange[0].toISOString() : null,
        endAt: dateRange?.[1] ? dateRange[1].toISOString() : null,
      });
    });
  };

  return (
    <FormDrawer
      open={open}
      title={isEdit ? `Düzenle: ${item?.title ?? item?.key}` : "İçerik Oluştur"}
      submitText={isEdit ? "Değişiklikleri Kaydet" : "İçerik Oluştur"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="key"
          label="Anahtar"
          rules={[
            { required: true, min: 2, max: 150 },
            { pattern: /^[a-z0-9]+(-[a-z0-9]+)*$/, message: "Yalnızca küçük harf, rakam ve tire kullanılabilir" },
          ]}
        >
          <Input placeholder="örn. summer-sale-2026" />
        </Form.Item>
        <Form.Item name="type" label="Tür" rules={[{ required: true }]}>
          <Select options={CONTENT_TYPES.map((t) => ({ value: t, label: CONTENT_TYPE_LABELS[t] ?? t }))} />
        </Form.Item>
        <Form.Item name="title" label="Başlık" rules={[{ max: 300 }]}>
          <Input placeholder="Görüntülenen başlık" />
        </Form.Item>
        <Form.Item name="description" label="Açıklama" rules={[{ max: 2000 }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="imageUrl" label="Görsel URL" rules={[{ type: "url" }]}>
          <Input placeholder="https://..." />
        </Form.Item>
        <Form.Item name="linkUrl" label="Bağlantı URL" rules={[{ max: 1000 }]}>
          <Input placeholder="İsteğe bağlı hedef bağlantı" />
        </Form.Item>
        <Form.Item name="dateRange" label="Yayın Aralığı">
          <DatePicker.RangePicker style={{ width: "100%" }} format="DD MMM YYYY" allowEmpty={[true, true]} />
        </Form.Item>
        <Form.Item name="isActive" label="Aktif" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
