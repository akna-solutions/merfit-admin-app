import React, { useEffect, useState } from "react";
import { Form, Input, Select, DatePicker, Button, Alert, Divider, InputNumber } from "antd";
import { TeamOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { FormDrawer } from "../../../components/admin";
import { notificationCampaignService, notificationTemplateService } from "../services/notificationService";
import { NOTIFICATION_TYPE_LABELS, SEGMENT_LABELS, APP_LABELS, toOptions, typesForApp } from "../utils/notificationLabels";
import {
  SCREEN_LABELS, screenToDataJson, dataJsonToScreen, dataJsonToProductId, screensForApp, disallowedPlaceholders, parseUserIds,
} from "../utils/notificationForm";
import NotificationPreviewCard from "./NotificationPreviewCard";
import AudienceSummary from "./AudienceSummary";

/** Kampanya taslagi olusturma / duzenleme. Gonderim burada yapilmaz; ayri "Zamanla / Gonder" adimi vardir. */
/** app: "MbFit" | "MbShop" - tur ve ekran secenekleri bu uygulamaya gore daraltilir. */
export default function CampaignFormDrawer({ open, campaign, app = "MbFit", metadata, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const [templates, setTemplates] = useState([]);
  const [audience, setAudience] = useState(null);
  const [audienceLoading, setAudienceLoading] = useState(false);
  const [audienceError, setAudienceError] = useState(null);
  const [preview, setPreview] = useState(null);
  const isEdit = Boolean(campaign);

  const type = Form.useWatch("type", form);
  const segment = Form.useWatch("segment", form);
  const title = Form.useWatch("title", form);
  const body = Form.useWatch("body", form);
  const screen = Form.useWatch("screen", form);
  const productId = Form.useWatch("productId", form);
  const isShop = app === "MbShop";
  const campaignTypes = typesForApp(metadata.campaignTypes?.length ? metadata.campaignTypes : ["Announcement", "Marketing", "System", "StorePromotion"], app, metadata);
  const screens = screensForApp(metadata, app);
  const singleUserId = Form.useWatch("singleUserId", form);
  const selectedUserIds = Form.useWatch("selectedUserIds", form);
  const allowed = metadata.placeholdersByType?.[type] ?? ["firstName"];
  const invalid = disallowedPlaceholders([title ?? "", body ?? ""], allowed);

  useEffect(() => {
    if (!open) return;
    setAudience(null);
    setAudienceError(null);
    form.setFieldsValue(
      campaign
        ? {
            ...campaign,
            screen: dataJsonToScreen(campaign.dataJson),
            productId: dataJsonToProductId(campaign.dataJson),
            expiresAtUtc: campaign.expiresAtUtc ? dayjs(campaign.expiresAtUtc) : null,
            singleUserId: campaign.segment === "SingleUser" ? campaign.userIds?.[0] : undefined,
            selectedUserIds: campaign.segment === "SelectedUsers" ? campaign.userIds?.map(String) : [],
          }
        : isShop
          ? { type: "StorePromotion", segment: "AllUsers", screen: "store", selectedUserIds: [] }
          : { type: "Announcement", segment: "AllUsers", screen: "dashboard", selectedUserIds: [] },
    );
  }, [open, campaign, form, isShop]);

  useEffect(() => {
    if (!open || !type) return;
    notificationTemplateService
      .getTemplates({ page: 1, pageSize: 100, type, isActive: true })
      .then((res) => setTemplates(res.data.items))
      .catch(() => setTemplates([]));
  }, [open, type]);

  useEffect(() => {
    setAudience(null);
  }, [segment, singleUserId, selectedUserIds]);

  useEffect(() => {
    if (!open || !type || !title || !body || invalid.length > 0) {
      setPreview(null);
      return undefined;
    }
    const handle = setTimeout(() => {
      notificationTemplateService
        .preview({ type, title, body, dataJson: screenToDataJson(screen, productId), userId: segment === "SingleUser" ? singleUserId : undefined })
        .then((res) => setPreview(res.data))
        .catch(() => setPreview(null));
    }, 400);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, type, title, body, screen, productId, segment, singleUserId, invalid.join(",")]);

  const userIdsFor = (values) => {
    if (values.segment === "SingleUser") return values.singleUserId ? [values.singleUserId] : [];
    if (values.segment === "SelectedUsers") return parseUserIds(values.selectedUserIds);
    return undefined;
  };

  const loadAudience = async () => {
    const values = form.getFieldsValue();
    setAudienceLoading(true);
    setAudienceError(null);
    try {
      const res = await notificationCampaignService.previewAudience({ segment: values.segment, userIds: userIdsFor(values) });
      setAudience(res.data);
    } catch (error) {
      setAudience(null);
      setAudienceError(error.message);
    } finally {
      setAudienceLoading(false);
    }
  };

  const applyTemplate = (templateId) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;
    form.setFieldsValue({
      title: template.titleTemplate,
      body: template.bodyTemplate,
      screen: dataJsonToScreen(template.dataJson) ?? form.getFieldValue("screen"),
      productId: dataJsonToProductId(template.dataJson) ?? form.getFieldValue("productId"),
    });
  };

  const handleSubmit = () =>
    form.validateFields().then((values) =>
      onSubmit({
        name: values.name,
        type: values.type,
        segment: values.segment,
        userIds: userIdsFor(values),
        notificationTemplateId: values.notificationTemplateId ?? null,
        title: values.title,
        body: values.body,
        dataJson: screenToDataJson(values.screen, values.productId),
        expiresAtUtc: values.expiresAtUtc ? values.expiresAtUtc.toISOString() : null,
      }),
    );

  return (
    <FormDrawer
      open={open}
      width={600}
      title={isEdit ? `"${campaign?.name}" Kampanyasını Düzenle` : `${APP_LABELS[app]} Kampanyası Oluştur`}
      submitText={isEdit ? "Taslağı Kaydet" : "Taslak Oluştur"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Kampanya adı (yalnızca panelde)" rules={[{ required: true, max: 150 }]}>
          <Input placeholder="örn. Ekim yeni program duyurusu" />
        </Form.Item>
        <Form.Item name="type" label="Bildirim türü" rules={[{ required: true }]} extra="Kullanıcılar bildirim tercihlerinden türleri kapatabilir.">
          <Select options={toOptions(NOTIFICATION_TYPE_LABELS, campaignTypes)} />
        </Form.Item>

        <Divider plain>Kitle</Divider>
        <Form.Item name="segment" label="Hedef" rules={[{ required: true }]}>
          <Select options={toOptions(SEGMENT_LABELS, metadata.segments?.length ? metadata.segments : undefined)} />
        </Form.Item>
        {segment === "SingleUser" && (
          <Form.Item name="singleUserId" label="Kullanıcı ID" rules={[{ required: true, message: "Kullanıcı ID zorunludur" }]}>
            <InputNumber min={1} style={{ width: "100%" }} placeholder="örn. 42" />
          </Form.Item>
        )}
        {segment === "SelectedUsers" && (
          <Form.Item
            name="selectedUserIds"
            label="Kullanıcı ID'leri"
            rules={[{ required: true, type: "array", min: 1, message: "En az bir kullanıcı ID girin" }]}
            extra={`ID'leri yazıp Enter'a basın veya virgülle ayırarak yapıştırın (en fazla ${metadata.maxSelectedUsers}).`}
          >
            <Select mode="tags" tokenSeparators={[",", " ", ";", "\n"]} open={false} placeholder="12, 15, 18" />
          </Form.Item>
        )}
        <Button icon={<TeamOutlined />} onClick={loadAudience} loading={audienceLoading} style={{ marginBottom: 12 }}>
          Kitleyi Önizle
        </Button>
        {audienceError && <Alert type="error" showIcon message={audienceError} style={{ marginBottom: 12 }} />}
        <AudienceSummary preview={audience} />

        <Divider plain>Mesaj</Divider>
        <Form.Item name="notificationTemplateId" label="Şablondan başla (isteğe bağlı)">
          <Select
            allowClear
            placeholder={templates.length ? "Şablon seçin" : "Bu türde aktif şablon yok"}
            options={templates.map((t) => ({ value: t.id, label: t.name }))}
            onChange={applyTemplate}
          />
        </Form.Item>
        <Alert
          type={invalid.length ? "error" : "info"}
          showIcon
          style={{ marginBottom: 16 }}
          message={invalid.length ? `Kampanyalarda kullanılamayan alanlar: ${invalid.map((p) => `{${p}}`).join(", ")}` : "Kullanılabilecek alan: {firstName}"}
        />
        <Form.Item name="title" label="Başlık" rules={[{ required: true, max: 200 }]}>
          <Input placeholder="örn. Merhaba {firstName}" />
        </Form.Item>
        <Form.Item name="body" label="İçerik" rules={[{ required: true, max: 500 }]}>
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
        <Form.Item
          name="expiresAtUtc"
          label="Son geçerlilik (isteğe bağlı)"
          extra="Bu zamandan sonra henüz gönderilmemiş push'lar gönderilmez (örn. sessiz saatlere takılanlar)."
          rules={[{ validator: (_, v) => (!v || v.isAfter(dayjs()) ? Promise.resolve() : Promise.reject(new Error("Gelecekte bir zaman seçin"))) }]}
        >
          <DatePicker showTime={{ format: "HH:mm" }} format="DD.MM.YYYY HH:mm" style={{ width: "100%" }} />
        </Form.Item>
      </Form>
      <Divider plain>Önizleme</Divider>
      <NotificationPreviewCard
        title={preview?.title ?? title}
        body={preview?.body ?? body}
        screen={screen}
        app={app}
        note={preview ? "{firstName} örnek değerle dolduruldu." : undefined}
      />
    </FormDrawer>
  );
}
