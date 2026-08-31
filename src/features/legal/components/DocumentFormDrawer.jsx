import React, { useEffect } from "react";
import { Form, Input, Select, Switch, Space, DatePicker } from "antd";
import dayjs from "dayjs";
import { FormDrawer } from "../../../components/admin";
import { LEGAL_DOCUMENT_TYPE } from "../services/legalService";

export default function DocumentFormDrawer({ open, document, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(document);

  useEffect(() => {
    if (open) {
      form.setFieldsValue(
        document
          ? { ...document, publishedAt: document.publishedAt ? dayjs(document.publishedAt) : undefined }
          : { type: "PrivacyPolicy", isActive: false },
      );
    }
  }, [open, document, form]);

  const handleSubmit = () =>
    form.validateFields().then((values) =>
      onSubmit({
        ...values,
        publishedAt: values.publishedAt ? values.publishedAt.toISOString() : undefined,
      }),
    );

  return (
    <FormDrawer
      open={open}
      title={isEdit ? `Edit ${document?.title}` : "Create Legal Document"}
      submitText={isEdit ? "Save Changes" : "Create Document"}
      submitting={submitting}
      width={640}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="Title" rules={[{ required: true, min: 2, max: 300 }]}>
          <Input placeholder="e.g. Privacy Policy" />
        </Form.Item>
        <Space size={16} style={{ width: "100%" }}>
          <Form.Item name="type" label="Type" rules={[{ required: true }]} style={{ flex: 1 }}>
            <Select options={LEGAL_DOCUMENT_TYPE.map((t) => ({ value: t, label: t }))} />
          </Form.Item>
          <Form.Item
            name="version"
            label="Version"
            rules={[{ required: true, min: 1, max: 50 }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="e.g. 1.0" />
          </Form.Item>
          <Form.Item
            name="language"
            label="Language Code"
            rules={[{ required: true, min: 2, max: 10 }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="e.g. tr" />
          </Form.Item>
        </Space>
        <Form.Item name="content" label="Content" rules={[{ required: true, message: "Content is required" }]}>
          <Input.TextArea rows={8} placeholder="Full document text (markdown or plain text)" />
        </Form.Item>
        <Space size={16} style={{ width: "100%" }}>
          <Form.Item name="publishedAt" label="Published At" style={{ flex: 1 }}>
            <DatePicker style={{ width: "100%" }} showTime />
          </Form.Item>
          <Form.Item name="isActive" label="Active" valuePropName="checked" style={{ flex: 1 }}>
            <Switch />
          </Form.Item>
        </Space>
      </Form>
    </FormDrawer>
  );
}
