import React, { useEffect } from "react";
import { Form, Input, InputNumber, Modal, Typography } from "antd";

/** Stok düzeltme: mevcut stoğa göre artı/eksi değişim gönderilir; sunucu atomik uygular ve eksiye düşürmez. */
export default function StockAdjustModal({ product, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const delta = Form.useWatch("delta", form) ?? 0;

  useEffect(() => {
    if (product) form.setFieldsValue({ delta: undefined, note: undefined });
  }, [product, form]);

  const handleOk = () => {
    form.validateFields().then((values) => onSubmit({ delta: Number(values.delta), note: values.note?.trim() || null }));
  };

  const next = product ? product.stockQuantity + Number(delta || 0) : 0;

  return (
    <Modal
      open={Boolean(product)}
      title={product ? `Stok düzelt: ${product.name}` : ""}
      okText="Uygula"
      cancelText="Vazgeç"
      confirmLoading={submitting}
      onOk={handleOk}
      onCancel={onClose}
      destroyOnHidden
    >
      <Typography.Paragraph>
        Mevcut stok: <strong>{product?.stockQuantity ?? 0}</strong> · Yeni stok: <strong style={{ color: next < 0 ? "#cf1322" : undefined }}>{next}</strong>
      </Typography.Paragraph>
      <Form form={form} layout="vertical">
        <Form.Item
          name="delta"
          label="Değişim"
          extra="Giriş için pozitif (örn. 20), çıkış/sayım farkı için negatif (örn. -3) girin."
          rules={[
            { required: true, message: "Değişim girin" },
            { validator: (_, v) => (Number(v) === 0 ? Promise.reject(new Error("0 olamaz")) : Promise.resolve()) },
            { validator: () => (next < 0 ? Promise.reject(new Error("Stok eksiye düşemez")) : Promise.resolve()) },
          ]}
        >
          <InputNumber min={-1000000} max={1000000} precision={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="note" label="Not" rules={[{ max: 200 }]}>
          <Input maxLength={200} placeholder="örn. Depo sayımı" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
