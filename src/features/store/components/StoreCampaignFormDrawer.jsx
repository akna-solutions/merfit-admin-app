import React, { useEffect, useState } from "react";
import { DatePicker, Form, Input, InputNumber, Select, Switch } from "antd";
import { FormDrawer, ImageUrlInput } from "../../../components/admin";
import { storeProductService } from "../services/storeService";
import { HEX_COLOR_PATTERN, campaignToFormValues, campaignToPayload, httpsUrlRule } from "../utils/storeForms";

export default function StoreCampaignFormDrawer({ open, item, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const [productOptions, setProductOptions] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [search, setSearch] = useState("");
  const isEdit = Boolean(item);

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue(campaignToFormValues(item));
      setSearch("");
    }
  }, [open, item, form]);

  // Ürün seçici sunucuda arar (ad, marka, SKU); seçili ürünlerin etiketleri listede yoksa "#id" gösterilir.
  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoadingProducts(true);
      try {
        const response = await storeProductService.getProducts({ page: 1, pageSize: 100, search: search || undefined });
        if (!cancelled) {
          setProductOptions((prev) => {
            const byId = new Map(prev.map((o) => [o.value, o]));
            response.data.items.forEach((p) => byId.set(p.id, { value: p.id, label: `${p.name} · ${p.sku}` }));
            return [...byId.values()];
          });
        }
      } catch {
        // Seçici boş kalır; kaydetme sırasında sunucu bilinmeyen ürün id'lerini reddeder.
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    }, 300);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [open, search]);

  const handleSubmit = () => {
    form.validateFields().then((values) => onSubmit(campaignToPayload(values)));
  };

  return (
    <FormDrawer
      open={open}
      width={560}
      title={isEdit ? `Düzenle: ${item?.title}` : "Mağaza Kampanyası Oluştur"}
      submitText={isEdit ? "Değişiklikleri Kaydet" : "Kampanya Oluştur"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="Başlık" rules={[{ required: true, whitespace: true, message: "Başlık zorunludur" }, { min: 2, max: 200 }]}>
          <Input maxLength={200} />
        </Form.Item>
        <Form.Item name="description" label="Açıklama" rules={[{ max: 500 }]}>
          <Input.TextArea rows={3} maxLength={500} showCount />
        </Form.Item>
        <Form.Item name="imageUrl" label="Görsel URL" rules={[{ max: 500 }, httpsUrlRule()]}>
          <ImageUrlInput previewAlt="Kampanya görseli önizlemesi" />
        </Form.Item>
        <Form.Item name="tint" label="Kart rengi" rules={[{ pattern: HEX_COLOR_PATTERN, message: "#RRGGBB formatında olmalıdır" }]}>
          <Input placeholder="#FFE5D0" maxLength={7} />
        </Form.Item>
        <Form.Item name="productIds" label="Ürünler" extra="Kampanya kartında ve kampanya listesinde bu ürünler gösterilir (en fazla 200).">
          <Select
            mode="multiple"
            showSearch
            filterOption={false}
            onSearch={setSearch}
            loading={loadingProducts}
            options={productOptions}
            placeholder="Ürün ara ve seç"
            optionRender={(option) => option.label}
            labelRender={({ value, label }) => label ?? `#${value}`}
          />
        </Form.Item>
        <Form.Item name="dateRange" label="Yayın aralığı" extra="Boş bırakılırsa süresiz yayında kalır.">
          <DatePicker.RangePicker style={{ width: "100%" }} format="DD MMM YYYY" allowEmpty={[true, true]} />
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
