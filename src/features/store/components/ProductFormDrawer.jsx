import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Divider, Form, Input, InputNumber, Row, Select, Space, Switch, Typography } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { FormDrawer, ImageUrlInput } from "../../../components/admin";
import { VARIANT_KIND_LABELS } from "../utils/storeLabels";
import { HEX_COLOR_PATTERN, SKU_PATTERN, VARIANT_ID_PATTERN, httpsUrlRule, productToFormValues, productToPayload, validateProductPayload } from "../utils/storeForms";

const kindOptions = Object.entries(VARIANT_KIND_LABELS).map(([value, label]) => ({ value, label }));

export default function ProductFormDrawer({ open, item, categories, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const [clientErrors, setClientErrors] = useState([]);
  const isEdit = Boolean(item);

  useEffect(() => {
    if (open) {
      form.resetFields();
      form.setFieldsValue(productToFormValues(item));
      setClientErrors([]);
    }
  }, [open, item, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const payload = productToPayload(values);
      const errors = validateProductPayload(payload);
      setClientErrors(errors);
      if (errors.length === 0) onSubmit(payload);
    });
  };

  return (
    <FormDrawer
      open={open}
      width={760}
      title={isEdit ? `Düzenle: ${item?.name}` : "Ürün Ekle"}
      submitText={isEdit ? "Değişiklikleri Kaydet" : "Ürün Ekle"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      {clientErrors.length > 0 && (
        <Alert
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          message="Kaydetmeden önce düzeltin"
          description={
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {clientErrors.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          }
        />
      )}
      <Form form={form} layout="vertical">
        <Row gutter={12}>
          <Col xs={24} md={14}>
            <Form.Item name="name" label="Ürün adı" rules={[{ required: true, whitespace: true, message: "Ürün adı zorunludur" }, { min: 2, max: 200 }]}>
              <Input maxLength={200} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10}>
            <Form.Item name="brand" label="Marka" rules={[{ required: true, whitespace: true, message: "Marka zorunludur" }, { max: 100 }]}>
              <Input maxLength={100} />
            </Form.Item>
          </Col>
          <Col xs={24} md={10}>
            <Form.Item
              name="sku"
              label="SKU"
              extra="Benzersiz olmalıdır; büyük harfe çevrilir."
              rules={[
                { required: true, whitespace: true, message: "SKU zorunludur" },
                { min: 2, max: 64 },
                { pattern: SKU_PATTERN, message: "Yalnızca harf, rakam, nokta, alt çizgi ve tire" },
              ]}
            >
              <Input maxLength={64} style={{ textTransform: "uppercase" }} />
            </Form.Item>
          </Col>
          <Col xs={24} md={14}>
            <Form.Item name="categoryId" label="Kategori" rules={[{ required: true, message: "Kategori seçin" }]}>
              <Select
                showSearch
                optionFilterProp="label"
                placeholder="Kategori seçin"
                options={categories.map((c) => ({ value: c.id, label: c.parentCategoryName ? `${c.parentCategoryName} / ${c.name}` : c.name }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="slug" label="Slug" extra="Boş bırakılırsa ürün adından üretilir.">
              <Input maxLength={220} placeholder="whey-protein-2kg" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item name="description" label="Açıklama" rules={[{ required: true, whitespace: true, message: "Açıklama zorunludur" }, { min: 10, max: 4000 }]}>
              <Input.TextArea rows={4} maxLength={4000} showCount />
            </Form.Item>
          </Col>
        </Row>

        <Divider titlePlacement="start">Fiyat ve stok</Divider>
        <Row gutter={12}>
          <Col xs={12} md={8}>
            <Form.Item name="price" label="Satış fiyatı (₺)" rules={[{ required: true, message: "Fiyat zorunludur" }]}>
              <InputNumber min={0.01} max={1000000} precision={2} decimalSeparator="," style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={12} md={8}>
            <Form.Item name="discountPrice" label="İndirimli fiyat (₺)" extra="Boşsa indirim yok.">
              <InputNumber min={0.01} max={1000000} precision={2} decimalSeparator="," style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={12} md={8}>
            <Form.Item
              name="stockQuantity"
              label="Stok"
              extra={isEdit ? "Stok, listeden “Stok düzelt” ile değiştirilir." : undefined}
              rules={[{ required: true, message: "Stok zorunludur" }]}
            >
              <InputNumber min={0} max={1000000} precision={0} disabled={isEdit} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={12} md={8}>
            <Form.Item name="sortOrder" label="Sıra">
              <InputNumber min={0} max={10000} precision={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={12} md={8}>
            <Form.Item name="isActive" label="Satışta" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={12} md={8}>
            <Form.Item name="isFeatured" label="Öne çıkan" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Divider titlePlacement="start">Görseller</Divider>
        <Typography.Paragraph type="secondary">İlk görsel ana görsel olur. Yalnızca https adresleri kabul edilir (en fazla 10).</Typography.Paragraph>
        <Form.List name="imageUrls">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Space key={field.key} align="start" style={{ display: "flex" }}>
                  <Form.Item
                    {...field}
                    style={{ flex: 1, minWidth: 520 }}
                    rules={[{ required: true, whitespace: true, message: "Adres girin veya satırı silin" }, { max: 500 }, httpsUrlRule()]}
                  >
                    <ImageUrlInput previewHeight={index === 0 ? 140 : 80} previewAlt="Ürün görseli önizlemesi" />
                  </Form.Item>
                  <Button icon={<DeleteOutlined />} aria-label="Görseli kaldır" onClick={() => remove(field.name)} />
                </Space>
              ))}
              <Button type="dashed" icon={<PlusOutlined />} onClick={() => add("")} disabled={fields.length >= 10}>
                Görsel ekle
              </Button>
            </>
          )}
        </Form.List>

        <Divider titlePlacement="start">Öne çıkan özellikler</Divider>
        <Form.List name="features">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Space key={field.key} align="start" style={{ display: "flex" }}>
                  <Form.Item {...field} style={{ flex: 1, minWidth: 520 }} rules={[{ max: 200 }]}>
                    <Input placeholder="örn. 24 g protein / porsiyon" />
                  </Form.Item>
                  <Button icon={<DeleteOutlined />} aria-label="Özelliği kaldır" onClick={() => remove(field.name)} />
                </Space>
              ))}
              <Button type="dashed" icon={<PlusOutlined />} onClick={() => add("")} disabled={fields.length >= 20}>
                Özellik ekle
              </Button>
            </>
          )}
        </Form.List>

        <Divider titlePlacement="start">Teknik özellikler</Divider>
        <Form.List name="specs">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Space key={field.key} align="start" style={{ display: "flex" }}>
                  <Form.Item name={[field.name, "label"]} rules={[{ required: true, message: "Başlık" }, { max: 80 }]}>
                    <Input placeholder="Başlık" />
                  </Form.Item>
                  <Form.Item name={[field.name, "value"]} style={{ minWidth: 320 }} rules={[{ required: true, message: "Değer" }, { max: 200 }]}>
                    <Input placeholder="Değer" />
                  </Form.Item>
                  <Button icon={<DeleteOutlined />} aria-label="Teknik özelliği kaldır" onClick={() => remove(field.name)} />
                </Space>
              ))}
              <Button type="dashed" icon={<PlusOutlined />} onClick={() => add({ label: "", value: "" })} disabled={fields.length >= 30}>
                Teknik özellik ekle
              </Button>
            </>
          )}
        </Form.List>

        <Divider titlePlacement="start">Varyantlar</Divider>
        <Typography.Paragraph type="secondary">
          Kodlar küçük harf, rakam, - ve _ içerebilir (örn. <code>size</code>, <code>xl</code>). Fiyat farkı hem satış hem indirimli fiyata eklenir.
          Ürün stoğu tüm varyantlar için ortaktır; stokta olmayan seçeneği kapatabilirsiniz.
        </Typography.Paragraph>
        <Form.List name="variants">
          {(groups, { add: addGroup, remove: removeGroup }) => (
            <>
              {groups.map((group) => (
                <Card
                  key={group.key}
                  size="small"
                  style={{ marginBottom: 12 }}
                  title={
                    <Space wrap>
                      <Form.Item name={[group.name, "label"]} noStyle rules={[{ required: true, message: "Grup adı" }]}>
                        <Input placeholder="Grup adı (örn. Beden)" style={{ width: 180 }} />
                      </Form.Item>
                      <Form.Item name={[group.name, "id"]} noStyle rules={[{ required: true, pattern: VARIANT_ID_PATTERN, message: "Kod" }]}>
                        <Input placeholder="kod (örn. size)" style={{ width: 140 }} />
                      </Form.Item>
                      <Form.Item name={[group.name, "kind"]} noStyle>
                        <Select options={kindOptions} style={{ width: 120 }} />
                      </Form.Item>
                    </Space>
                  }
                  extra={<Button type="text" danger icon={<DeleteOutlined />} aria-label="Varyant grubunu kaldır" onClick={() => removeGroup(group.name)} />}
                >
                  <Form.List name={[group.name, "options"]}>
                    {(options, { add, remove }) => (
                      <>
                        {options.map((option) => (
                          <Space key={option.key} align="start" wrap style={{ display: "flex" }}>
                            <Form.Item name={[option.name, "label"]} rules={[{ required: true, message: "Etiket" }, { max: 60 }]}>
                              <Input placeholder="Etiket (örn. XL)" style={{ width: 150 }} />
                            </Form.Item>
                            <Form.Item name={[option.name, "id"]} rules={[{ required: true, pattern: VARIANT_ID_PATTERN, message: "Kod" }]}>
                              <Input placeholder="kod (örn. xl)" style={{ width: 110 }} />
                            </Form.Item>
                            <Form.Item name={[option.name, "priceDelta"]} tooltip="Fiyat farkı (₺)">
                              <InputNumber placeholder="± ₺" precision={2} decimalSeparator="," style={{ width: 100 }} />
                            </Form.Item>
                            <Form.Item name={[option.name, "swatch"]} rules={[{ pattern: HEX_COLOR_PATTERN, message: "#RRGGBB" }]}>
                              <Input placeholder="#RRGGBB" style={{ width: 100 }} />
                            </Form.Item>
                            <Form.Item name={[option.name, "inStock"]} valuePropName="checked">
                              <Switch checkedChildren="Stokta" unCheckedChildren="Yok" />
                            </Form.Item>
                            <Button icon={<DeleteOutlined />} aria-label="Seçeneği kaldır" onClick={() => remove(option.name)} />
                          </Space>
                        ))}
                        <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={() => add({ id: "", label: "", priceDelta: 0, inStock: true })}>
                          Seçenek ekle
                        </Button>
                      </>
                    )}
                  </Form.List>
                </Card>
              ))}
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                disabled={groups.length >= 5}
                onClick={() => addGroup({ id: "", label: "", kind: "option", options: [{ id: "", label: "", priceDelta: 0, inStock: true }] })}
              >
                Varyant grubu ekle
              </Button>
            </>
          )}
        </Form.List>
      </Form>
    </FormDrawer>
  );
}
