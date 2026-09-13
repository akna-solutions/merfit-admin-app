import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Select, Switch, Space, Divider, Button, Spin, App } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { FormDrawer } from "../../../components/admin";
import { subscriptionProductService, featureService } from "../services/subscriptionsService";

// Feature attachment editor — mirrors the real API's replace-all endpoint
// (GET/PUT /api/admin/subscription-products/{id}/features). Was completely
// unused before: subscriptionProductService.getFeatures/setFeatures existed
// but no screen ever called them, so products could never actually be
// linked to a Feature.
function FeaturesEditor({ productId }) {
  const { message } = App.useApp();
  const [allFeatures, setAllFeatures] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    Promise.all([
      featureService.getFeatures({ pageSize: 200 }),
      subscriptionProductService.getFeatures(productId),
    ]).then(([featuresRes, productFeaturesRes]) => {
      setAllFeatures(featuresRes.data.items);
      setSelectedIds((productFeaturesRes.data ?? []).map((f) => f.id));
      setLoading(false);
    });
  }, [productId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await subscriptionProductService.setFeatures(productId, selectedIds);
      message.success("Özellikler kaydedildi.");
    } finally {
      setSaving(false);
    }
  };

  if (!productId) {
    return <Select disabled placeholder="Özellik eklemek için önce ürünü kaydedin" style={{ width: "100%" }} />;
  }
  if (loading) return <Spin />;

  return (
    <>
      <Select
        mode="multiple"
        style={{ width: "100%" }}
        placeholder="Bu ürüne dahil özellikleri seçin"
        value={selectedIds}
        onChange={setSelectedIds}
        options={allFeatures.map((f) => ({ value: f.id, label: f.name }))}
      />
      <Button
        type="primary"
        icon={<SaveOutlined />}
        onClick={handleSave}
        loading={saving}
        style={{ marginTop: 12 }}
      >
        Özellikleri Kaydet
      </Button>
    </>
  );
}

export default function ProductFormDrawer({ open, product, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(product);

  useEffect(() => {
    if (open) {
      form.setFieldsValue(product ?? { billingPeriod: "Monthly", currency: "TRY", isActive: true });
    }
  }, [open, product, form]);

  const handleSubmit = () => form.validateFields().then(onSubmit);

  return (
    <FormDrawer
      open={open}
      title={isEdit ? `${product?.name} Ürününü Düzenle` : "Ürün Oluştur"}
      submitText={isEdit ? "Değişiklikleri Kaydet" : "Ürün Oluştur"}
      submitting={submitting}
      width={560}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="İsim" rules={[{ required: true, min: 2, max: 200 }]}>
          <Input placeholder="örn. MB Fit Plus — Aylık" />
        </Form.Item>
        <Form.Item name="code" label="Kod" rules={[{ required: true, min: 2, max: 100 }]}>
          <Input placeholder="örn. plus_monthly" />
        </Form.Item>
        <Space size={16} style={{ width: "100%" }}>
          <Form.Item name="billingPeriod" label="Faturalandırma Dönemi" rules={[{ required: true }]} style={{ flex: 1 }}>
            <Select options={[{ value: "Monthly", label: "Aylık" }, { value: "Yearly", label: "Yıllık" }]} />
          </Form.Item>
          <Form.Item name="price" label="Fiyat" rules={[{ required: true, type: "number", min: 0, max: 100000 }]} style={{ flex: 1 }}>
            <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
          </Form.Item>
          <Form.Item
            name="currency"
            label="Para Birimi"
            rules={[{ required: true, len: 3, message: "3 harfli ISO kodu" }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="TRY" maxLength={3} />
          </Form.Item>
        </Space>
        <Form.Item name="storeProductIdIos" label="iOS Ürün Kimliği" rules={[{ max: 200 }]}>
          <Input placeholder="com.mbfit.plus.monthly" />
        </Form.Item>
        <Form.Item name="storeProductIdAndroid" label="Android Ürün Kimliği" rules={[{ max: 200 }]}>
          <Input placeholder="plus_monthly" />
        </Form.Item>
        <Form.Item name="isActive" label="Aktif" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>

      <Divider>Özellikler</Divider>
      <FeaturesEditor productId={product?.id} />
    </FormDrawer>
  );
}
