import React, { useEffect } from "react";
import { Form, Input, Select, Switch, Space, DatePicker } from "antd";
import dayjs from "dayjs";
import { FormDrawer } from "../../../components/admin";
import { LEGAL_DOCUMENT_TYPE, LEGAL_DOCUMENT_TYPE_LABELS } from "../services/legalService";

export default function DocumentFormDrawer({ open, document, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(document);

  useEffect(() => {
    if (open) {
      form.setFieldsValue(
        document
          ? { ...document, publishedAt: document.publishedAt ? dayjs(document.publishedAt) : undefined }
          : { type: "PrivacyPolicy", isActive: false },
      );
    }
  }, [open, document, form]);

  const handleSubmit = () =>
    form.validateFields().then((values) =>
      onSubmit({
        ...values,
        publishedAt: values.publishedAt ? values.publishedAt.toISOString() : undefined,
      }),
    );

  return (
    <FormDrawer
      open={open}
      title={isEdit ? `"${document?.title}" Belgesini Düzenle` : "Hukuki Belge Oluştur"}
      submitText={isEdit ? "Değişiklikleri Kaydet" : "Belge Oluştur"}
      submitting={submitting}
      width={640}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="Başlık" rules={[{ required: true, min: 2, max: 300 }]}>
          <Input placeholder="örn. Gizlilik Politikası" />
        </Form.Item>
        <Space size={16} style={{ width: "100%" }}>
          <Form.Item name="type" label="Tür" rules={[{ required: true }]} style={{ flex: 1 }}>
            <Select options={LEGAL_DOCUMENT_TYPE.map((t) => ({ value: t, label: LEGAL_DOCUMENT_TYPE_LABELS[t] }))} />
          </Form.Item>
          <Form.Item
            name="version"
            label="Sürüm"
            rules={[{ required: true, min: 1, max: 50 }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="örn. 1.0" />
          </Form.Item>
          <Form.Item
            name="language"
            label="Dil Kodu"
            rules={[{ required: true, min: 2, max: 10 }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="örn. tr" />
          </Form.Item>
        </Space>
        <Form.Item name="content" label="İçerik" rules={[{ required: true, message: "İçerik zorunludur" }]}>
          <Input.TextArea rows={8} placeholder="Belgenin tam metni (markdown veya düz metin)" />
        </Form.Item>
        <Space size={16} style={{ width: "100%" }}>
          <Form.Item name="publishedAt" label="Yayınlanma Tarihi" style={{ flex: 1 }}>
            <DatePicker style={{ width: "100%" }} showTime />
          </Form.Item>
          <Form.Item name="isActive" label="Aktif" valuePropName="checked" style={{ flex: 1 }}>
            <Switch />
          </Form.Item>
        </Space>
      </Form>
    </FormDrawer>
  );
}
