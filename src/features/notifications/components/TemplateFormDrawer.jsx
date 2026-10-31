import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Select, Switch, Alert, Typography, Divider } from "antd";
import { FormDrawer } from "../../../components/admin";
import { notificationTemplateService } from "../services/notificationService";
import { NOTIFICATION_TYPE_LABELS, APP_LABELS, toOptions, typesForApp } from "../utils/notificationLabels";
import {
  SCREEN_LABELS, screenToDataJson, dataJsonToScreen, dataJsonToProductId, screensForApp, disallowedPlaceholders,
} from "../utils/notificationForm";
import NotificationPreviewCard from "./NotificationPreviewCard";

const { Text } = Typography;

export default function TemplateFormDrawer({ open, template, app = "MbFit", metadata, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const [preview, setPreview] = useState(null);
  const isEdit = Boolean(template);
  const type = Form.useWatch("type", form);
  const title = Form.useWatch("titleTemplate", form);
  const body = Form.useWatch("bodyTemplate", form);
  const screen = Form.useWatch("screen", form);
  const productId = Form.useWatch("productId", form);
  const isShop = app === "MbShop";
  // Siparis durumu bildirimleri otomatik ve sabit metinlidir; sablon turu olarak MB Shop'ta yalnizca kampanya turu secilir.
  const types = typesForApp(metadata.types?.length ? metadata.types : Object.keys(NOTIFICATION_TYPE_LABELS), app, metadata)
    .filter((t) => t !== "StoreOrderUpdate");
  const screens = screensForApp(metadata, app);
  const allowed = metadata.placeholdersByType?.[type] ?? [];
  const invalid = disallowedPlaceholders([title ?? "", body ?? ""], allowed);

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue(
      template
        ? { ...template, screen: dataJsonToScreen(template.dataJson), productId: dataJsonToProductId(template.dataJson) }
        : isShop
          ? { type: "StorePromotion", isActive: true, screen: "store" }
          : { type: "DailyMotivation", isActive: true, screen: "dashboard" },
    );
  }, [open, template, form, isShop]);

  useEffect(() => {
    if (!open || !type || !title || !body || invalid.length > 0) {
      setPreview(null);
      return undefined;
    }
    const handle = setTimeout(() => {
      notificationTemplateService
        .preview({ type, title, body, dataJson: screenToDataJson(screen, productId) })
        .then((res) => setPreview(res.data))
        .catch(() => setPreview(null));
    }, 400);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, type, title, body, screen, productId, invalid.join(",")]);

  const handleSubmit = () =>
    form.validateFields().then(({ screen: selectedScreen, productId: selectedProductId, ...values }) =>
      onSubmit({ ...values, dataJson: screenToDataJson(selectedScreen, selectedProductId) }),
    );

  return (
    <FormDrawer
      open={open}
      width={560}
      title={isEdit ? `"${template?.name}" Şablonunu Düzenle` : `${APP_LABELS[app]} Şablonu Oluştur`}
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
          <Select options={toOptions(NOTIFICATION_TYPE_LABELS, types)} disabled={isEdit && template?.ruleCount > 0} />
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
          <Select allowClear options={screens.map((s) => ({ value: s, label: SCREEN_LABELS[s] ?? s }))} />
        </Form.Item>
        {screen === "storeProduct" && (
          <Form.Item name="productId" label="Ürün ID" rules={[{ required: true, message: "Açılacak ürünün ID'sini girin" }]}>
            <InputNumber min={1} style={{ width: "100%" }} placeholder="MB Shop > Ürünler listesindeki ID" />
          </Form.Item>
        )}
        <Form.Item name="isActive" label="Aktif" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
      <Divider plain>Önizleme</Divider>
      <NotificationPreviewCard
        title={preview?.title ?? title}
        body={preview?.body ?? body}
        screen={screen}
        app={app}
        note={preview ? "Örnek değerlerle dolduruldu." : undefined}
      />
      <Text type="secondary" style={{ display: "block", marginTop: 8, fontSize: 12 }}>
        Beslenme hatırlatıcılarında yargılayıcı olmayan, nötr bir dil kullanın.
      </Text>
    </FormDrawer>
  );
}
