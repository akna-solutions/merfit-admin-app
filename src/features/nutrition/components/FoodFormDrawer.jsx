import React, { useEffect } from "react";
import { Form, Input, InputNumber, Space } from "antd";
import { FormDrawer } from "../../../components/admin";

export default function FoodFormDrawer({ open, food, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(food);

  useEffect(() => {
    if (open) {
      form.setFieldsValue(food ?? { servingUnit: "g", servingSize: 100 });
    }
  }, [open, food, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => onSubmit(values));
  };

  return (
    <FormDrawer
      open={open}
      title={isEdit ? `Edit ${food?.name}` : "Add Food"}
      submitText={isEdit ? "Save Changes" : "Create Food"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Name" rules={[{ required: true, min: 2, max: 300 }]}>
          <Input placeholder="e.g. Chicken Breast" />
        </Form.Item>
        <Form.Item name="brand" label="Brand" rules={[{ max: 200 }]}>
          <Input placeholder="Optional" />
        </Form.Item>
        <Form.Item name="barcode" label="Barcode" rules={[{ max: 100 }]}>
          <Input placeholder="Optional" />
        </Form.Item>
        <Space size={16} style={{ width: "100%" }}>
          <Form.Item
            name="servingSize"
            label="Serving Size"
            rules={[{ required: true, type: "number", min: 0.01, max: 100000 }]}
            style={{ flex: 1 }}
          >
            <InputNumber style={{ width: "100%" }} min={0.01} />
          </Form.Item>
          <Form.Item
            name="servingUnit"
            label="Serving Unit"
            rules={[{ required: true, max: 20 }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="g, ml, piece" />
          </Form.Item>
        </Space>
        <Space size={16} style={{ width: "100%" }}>
          <Form.Item name="calories" label="Calories" rules={[{ required: true, type: "number", min: 0, max: 10000 }]} style={{ flex: 1 }}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item name="protein" label="Protein (g)" rules={[{ required: true, type: "number", min: 0, max: 1000 }]} style={{ flex: 1 }}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Space>
        <Space size={16} style={{ width: "100%" }}>
          <Form.Item name="carbs" label="Carbs (g)" rules={[{ required: true, type: "number", min: 0, max: 1000 }]} style={{ flex: 1 }}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item name="fat" label="Fat (g)" rules={[{ required: true, type: "number", min: 0, max: 1000 }]} style={{ flex: 1 }}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Space>
        <Space size={16} style={{ width: "100%" }}>
          <Form.Item name="fiber" label="Fiber (g)" rules={[{ type: "number", min: 0, max: 1000 }]} style={{ flex: 1 }}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item name="sugar" label="Sugar (g)" rules={[{ type: "number", min: 0, max: 1000 }]} style={{ flex: 1 }}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item name="sodium" label="Sodium (mg)" rules={[{ type: "number", min: 0, max: 100000 }]} style={{ flex: 1 }}>
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Space>
        <Form.Item name="imageUrl" label="Image URL" rules={[{ type: "url" }]}>
          <Input placeholder="https://..." />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
