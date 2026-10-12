import React, { useEffect, useState } from "react";
import { Form, Input, Select, Switch, Alert, Typography, Divider } from "antd";
import { FormDrawer } from "../../../components/admin";
import { notificationTemplateService } from "../services/notificationService";
import { NOTIFICATION_TYPE_LABELS, toOptions } from "../utils/notificationLabels";
import { SCREEN_LABELS, screenToDataJson, dataJsonToScreen, disallowedPlaceholders } from "../utils/notificationForm";
import NotificationPreviewCard from "./NotificationPreviewCard";

const { Text } = Typography;

export default function TemplateFormDrawer({ open, template, metadata, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const [preview, setPreview] = useState(null);
  const isEdit = Boolean(template);
  const type = Form.useWatch("type", form);
  const title = Form.useWatch("titleTemplate", form);
  const body = Form.useWatch("bodyTemplate", form);
  const screen = Form.useWatch("screen", form);
  const allowed = metadata.placeholdersByType?.[type] ?? [];
  const invalid = disallowedPlaceholders([title ?? "", body ?? ""], allowed);

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue(
      template
        ? { ...template, screen: dataJsonToScreen(template.dataJson) }
        : { type: "DailyMotivation", isActive: true, screen: "dashboard" },
    );
  }, [open, template, form]);

  useEffect(() => {
    if (!open || !type || !title || !body || invalid.length > 0) {
      setPreview(null);
      return undefined;
    }
    const handle = setTimeout(() => {
      notificationTemplateService
        .preview({ type, title, body, dataJson: screenToDataJson(screen) })
        .then((res) => setPreview(res.data))
        .catch(() => setPreview(null));
    }, 400);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, type, title, body, screen, invalid.join(",")]);

  const handleSubmit = () =>
    form.validateFields().then(({ screen: selectedScreen, ...values }) =>
      onSubmit({ ...values, dataJson: screenToDataJson(selectedScreen) }),
    );

  return (
    <FormDrawer
      open={open}
      width={560}
      title={isEdit ? `"${template?.name}" Şablonunu Düzenle` : "Şablon Oluştur"}
      submitText={isEdit ? "Değişiklikleri Kaydet" : "Şablon Oluştur"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Ad (yalnızca panelde görünür)" rules={[{ required: true, max: 150 }]}>
          <Input placeholder="örn. Motivasyon - küçük adımlar" />
        </Form.Item>
        <Form.Item
          name="type"
          label="Tür"
          rules={[{ required: true }]}
          extra={isEdit && template?.ruleCount > 0 ? "Kurallarda kullanılan şablonun türü değiştirilemez." : undefined}
        >
          <Select options={toOptions(NOTIFICATION_TYPE_LABELS, metadata.types?.length ? metadata.types : undefined)} disabled={isEdit && template?.ruleCount > 0} />
        </Form.Item>
        <Alert
          type={invalid.length ? "error" : "info"}
          showIcon
          style={{ marginBottom: 16 }}
          message={
            invalid.length
              ? `Bu türde kullanılamayan alanlar: ${invalid.map((p) => `{${p}}`).join(", ")}`
              : `Kullanılabilecek alanlar: ${allowed.map((p) => `{${p}}`).join(", ") || "—"}`
          }
        />
        <Form.Item name="titleTemplate" label="Başlık" rules={[{ required: true, max: 200 }]}>
          <Input placeholder="örn. Günaydın {firstName}" />
        </Form.Item>
        <Form.Item name="bodyTemplate" label="İçerik" rules={[{ required: true, max: 500 }]}>
          <Input.TextArea rows={3} showCount maxLength={500} />
        </Form.Item>
        <Form.Item name="screen" label="Dokununca açılacak ekran">
          <Select allowClear options={(metadata.screens?.length ? metadata.screens : Object.keys(SCREEN_LABELS)).map((s) => ({ value: s, label: SCREEN_LABELS[s] ?? s }))} />
        </Form.Item>
        <Form.Item name="isActive" label="Aktif" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
      <Divider plain>Önizleme</Divider>
      <NotificationPreviewCard
        title={preview?.title ?? title}
        body={preview?.body ?? body}
        screen={screen}
        note={preview ? "Örnek değerlerle dolduruldu." : undefined}
      />
      <Text type="secondary" style={{ display: "block", marginTop: 8, fontSize: 12 }}>
        Beslenme hatırlatıcılarında yargılayıcı olmayan, nötr bir dil kullanın.
      </Text>
    </FormDrawer>
  );
}
