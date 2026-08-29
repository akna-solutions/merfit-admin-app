import React, { useEffect } from "react";
import { Form, Input, Select, Switch, DatePicker } from "antd";
import dayjs from "dayjs";
import { FormDrawer } from "../../../components/admin";
import { CONTENT_TYPES } from "../data/contentMockData";

export default function ContentFormDrawer({ open, item, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(item);

  useEffect(() => {
    if (open) {
      form.setFieldsValue(
        item
          ? {
              ...item,
              dateRange: item.startAt || item.endAt
                ? [item.startAt ? dayjs(item.startAt) : null, item.endAt ? dayjs(item.endAt) : null]
                : undefined,
            }
          : { type: "Banner", isActive: true },
      );
    }
  }, [open, item, form]);

  const handleSubmit = () => {
    form.validateFields().then(({ dateRange, ...rest }) => {
      onSubmit({
        ...rest,
        startAt: dateRange?.[0] ? dateRange[0].toISOString() : null,
        endAt: dateRange?.[1] ? dateRange[1].toISOString() : null,
      });
    });
  };

  return (
    <FormDrawer
      open={open}
      title={isEdit ? `Edit ${item?.title ?? item?.key}` : "Create Content"}
      submitText={isEdit ? "Save Changes" : "Create Content"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="key"
          label="Key"
          rules={[
            { required: true, min: 2, max: 150 },
            { pattern: /^[a-z0-9]+(-[a-z0-9]+)*$/, message: "Lowercase letters, numbers and hyphens only" },
          ]}
        >
          <Input placeholder="e.g. summer-sale-2026" />
        </Form.Item>
        <Form.Item name="type" label="Type" rules={[{ required: true }]}>
          <Select options={CONTENT_TYPES.map((t) => ({ value: t, label: t }))} />
        </Form.Item>
        <Form.Item name="title" label="Title" rules={[{ max: 300 }]}>
          <Input placeholder="Display title" />
        </Form.Item>
        <Form.Item name="description" label="Description" rules={[{ max: 2000 }]}>
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item name="imageUrl" label="Image URL" rules={[{ type: "url" }]}>
          <Input placeholder="https://..." />
        </Form.Item>
        <Form.Item name="linkUrl" label="Link URL" rules={[{ max: 1000 }]}>
          <Input placeholder="Optional destination link" />
        </Form.Item>
        <Form.Item name="dateRange" label="Active Window">
          <DatePicker.RangePicker style={{ width: "100%" }} format="DD MMM YYYY" allowEmpty={[true, true]} />
        </Form.Item>
        <Form.Item name="isActive" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
