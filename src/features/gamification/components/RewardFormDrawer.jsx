import React, { useEffect } from "react";
import { Form, Input, Select, Switch } from "antd";
import { FormDrawer } from "../../../components/admin";

export default function RewardFormDrawer({ open, reward, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(reward);

  useEffect(() => {
    if (open) form.setFieldsValue(reward ?? { rewardType: "points", isActive: true });
  }, [open, reward, form]);

  const handleSubmit = () => form.validateFields().then(onSubmit);

  return (
    <FormDrawer
      open={open}
      title={isEdit ? `Edit ${reward?.title}` : "Create Reward"}
      submitText={isEdit ? "Save Changes" : "Create Reward"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="Title" rules={[{ required: true, min: 2, max: 200 }]}>
          <Input placeholder="e.g. 1 Month Free Plus" />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ max: 2000 }]}>
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item name="rewardType" label="Reward Type" rules={[{ required: true, max: 50 }]}>
          <Select
            options={[
              { value: "subscription", label: "Subscription" },
              { value: "physical", label: "Physical Item" },
              { value: "points", label: "Bonus Points" },
              { value: "service", label: "Service" },
            ]}
          />
        </Form.Item>
        <Form.Item name="value" label="Value" rules={[{ max: 500 }]}>
          <Input placeholder="Optional, e.g. 500 or plus_monthly:1" />
        </Form.Item>
        <Form.Item name="imageUrl" label="Image URL" rules={[{ type: "url" }]}>
          <Input placeholder="https://..." />
        </Form.Item>
        <Form.Item name="isActive" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
