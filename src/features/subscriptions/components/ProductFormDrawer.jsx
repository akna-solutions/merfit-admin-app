import React, { useEffect } from "react";
import { Form, Input, InputNumber, Select, Switch, Space } from "antd";
import { FormDrawer } from "../../../components/admin";

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
      title={isEdit ? `Edit ${product?.name}` : "Create Product"}
      submitText={isEdit ? "Save Changes" : "Create Product"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true, min: 2, max: 200 }]}>
          <Input placeholder="e.g. Merfit Plus — Monthly" />
        </Form.Item>
        <Form.Item name="code" label="Code" rules={[{ required: true, min: 2, max: 100 }]}>
          <Input placeholder="e.g. plus_monthly" />
        </Form.Item>
        <Space size={16} style={{ width: "100%" }}>
          <Form.Item name="billingPeriod" label="Billing Period" rules={[{ required: true }]} style={{ flex: 1 }}>
            <Select options={[{ value: "Monthly", label: "Monthly" }, { value: "Yearly", label: "Yearly" }]} />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true, type: "number", min: 0, max: 100000 }]} style={{ flex: 1 }}>
            <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
          </Form.Item>
          <Form.Item
            name="currency"
            label="Currency"
            rules={[{ required: true, len: 3, message: "3-letter ISO code" }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="TRY" maxLength={3} />
          </Form.Item>
        </Space>
        <Form.Item name="storeProductIdIos" label="iOS Product ID" rules={[{ max: 200 }]}>
          <Input placeholder="com.merfit.plus.monthly" />
        </Form.Item>
        <Form.Item name="storeProductIdAndroid" label="Android Product ID" rules={[{ max: 200 }]}>
          <Input placeholder="plus_monthly" />
        </Form.Item>
        <Form.Item name="isActive" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
