import React, { useEffect } from "react";
import { Form, Input, InputNumber, Switch, DatePicker } from "antd";
import { FormDrawer, ImageUrlInput } from "../../../components/admin";
import { BODY_MAX, SUMMARY_MAX, TITLE_MAX, httpUrlRule, toFormValues, toPayload } from "../utils/campaignForm";

export default function CampaignFormDrawer({ open, item, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(item);

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue(toFormValues(item));
    }
  }, [open, item, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => onSubmit(toPayload(values)));
  };

  return (
    <FormDrawer
      open={open}
      title={isEdit ? `Düzenle: ${item?.title}` : "Kampanya Oluştur"}
      submitText={isEdit ? "Değişiklikleri Kaydet" : "Kampanya Oluştur"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Başlık"
          rules={[
            { required: true, whitespace: true, message: "Başlık zorunludur" },
            { min: 2, max: TITLE_MAX, message: `Başlık 2-${TITLE_MAX} karakter olmalıdır` },
          ]}
        >
          <Input placeholder="örn. Yaz Kampanyası" maxLength={TITLE_MAX} />
        </Form.Item>
        <Form.Item
          name="summary"
          label="Kısa açıklama"
          extra="Ana sayfadaki kartta görünür."
          rules={[{ max: SUMMARY_MAX }]}
        >
          <Input.TextArea rows={2} maxLength={SUMMARY_MAX} showCount />
        </Form.Item>
        <Form.Item name="body" label="Detay metni" extra="Kampanya detay ekranında gösterilir." rules={[{ max: BODY_MAX }]}>
          <Input.TextArea rows={6} maxLength={BODY_MAX} />
        </Form.Item>
        <Form.Item
          name="imageUrl"
          label="Görsel URL"
          rules={[{ max: 500 }, httpUrlRule("Görsel adresi http(s) ile başlamalıdır")]}
        >
          <ImageUrlInput previewAlt="Kampanya görseli önizlemesi" />
        </Form.Item>
        <Form.Item
          name="linkUrl"
          label="Bağlantı URL"
          extra="İsteğe bağlı; detay ekranında “Kampanyaya git” düğmesi olarak açılır."
          rules={[{ max: 500 }, httpUrlRule("Bağlantı http(s) ile başlamalıdır")]}
        >
          <Input placeholder="https://..." />
        </Form.Item>
        <Form.Item name="category" label="Kategori" rules={[{ max: 100 }]}>
          <Input placeholder="örn. Üyelik, Beslenme" />
        </Form.Item>
        <Form.Item name="dateRange" label="Yayın aralığı" extra="Boş bırakılırsa süresiz yayında kalır.">
          <DatePicker.RangePicker style={{ width: "100%" }} format="DD MMM YYYY" allowEmpty={[true, true]} />
        </Form.Item>
        <Form.Item name="sortOrder" label="Sıra" extra="Küçük değer önce gösterilir.">
          <InputNumber min={0} max={10000} precision={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="isActive" label="Aktif" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
