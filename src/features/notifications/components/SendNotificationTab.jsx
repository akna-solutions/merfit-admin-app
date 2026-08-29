import React, { useState } from "react";
import { Form, Input, InputNumber, Select, DatePicker, Radio, Button, Card, Row, Col, Typography, App } from "antd";
import { SendOutlined, BellOutlined } from "@ant-design/icons";
import { notificationService, NOTIFICATION_SEGMENTS } from "../services/notificationService";

const { Title, Text, Paragraph } = Typography;

// Maps the chosen recipient type to which of the three real endpoints gets
// called (see AdminNotificationController: /user, /broadcast, /segment —
// three genuinely separate POST endpoints, not one generic "send" call).
export default function SendNotificationTab() {
  const { message, modal } = App.useApp();
  const [form] = Form.useForm();
  const [recipientType, setRecipientType] = useState("user");
  const [preview, setPreview] = useState({ title: "", body: "" });
  const [sending, setSending] = useState(false);

  const handleValuesChange = (_, all) => {
    setPreview({ title: all.title ?? "", body: all.body ?? "" });
  };

  const doSend = async (values) => {
    setSending(true);
    try {
      const payload = {
        title: values.title,
        body: values.body,
        imageUrl: values.imageUrl,
        dataJson: values.dataJson,
        expiresAt: values.expiresAt ? values.expiresAt.toISOString() : null,
      };
      let result;
      if (recipientType === "user") {
        result = await notificationService.sendToUser({ ...payload, userId: values.userId });
        message.success(`Notification sent to user #${values.userId}.`);
      } else if (recipientType === "broadcast") {
        result = await notificationService.broadcast(payload);
        message.success(`Notification broadcast to ${result.data.recipientCount} users.`);
      } else {
        result = await notificationService.sendToSegment({ ...payload, segment: values.segment });
        message.success(`Notification sent to ${result.data.recipientCount} users in "${values.segment}".`);
      }
      form.resetFields();
      setPreview({ title: "", body: "" });
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const audienceLabel =
        recipientType === "user"
          ? `user #${values.userId}`
          : recipientType === "broadcast"
            ? "ALL users"
            : NOTIFICATION_SEGMENTS.find((s) => s.value === values.segment)?.label;
      modal.confirm({
        title: "Send this notification?",
        content: `This will send "${values.title}" to ${audienceLabel}.`,
        okText: "Send",
        onOk: () => doSend(values),
      });
    });
  };

  return (
    <Row gutter={20}>
      <Col xs={24} lg={14}>
        <Card bordered={false} className="merfit-table-card">
          <Form form={form} layout="vertical" onValuesChange={handleValuesChange} initialValues={{ recipientType: "user" }}>
            <Form.Item label="Recipients">
              <Radio.Group
                value={recipientType}
                onChange={(e) => setRecipientType(e.target.value)}
                options={[
                  { value: "user", label: "Single User" },
                  { value: "segment", label: "Segment" },
                  { value: "broadcast", label: "All Users" },
                ]}
                optionType="button"
              />
            </Form.Item>

            {recipientType === "user" && (
              <Form.Item name="userId" label="User ID" rules={[{ required: true, message: "User ID is required" }]}>
                <InputNumber style={{ width: "100%" }} min={1} placeholder="e.g. 42" />
              </Form.Item>
            )}
            {recipientType === "segment" && (
              <Form.Item name="segment" label="Audience Segment" rules={[{ required: true, message: "Segment is required" }]}>
                <Select options={NOTIFICATION_SEGMENTS} placeholder="Select a segment" />
              </Form.Item>
            )}

            <Form.Item name="title" label="Title" rules={[{ required: true, max: 200 }]}>
              <Input placeholder="e.g. Time for your workout!" />
            </Form.Item>
            <Form.Item name="body" label="Body" rules={[{ required: true, max: 2000 }]}>
              <Input.TextArea rows={3} placeholder="Notification message" />
            </Form.Item>
            <Form.Item name="imageUrl" label="Image URL" rules={[{ type: "url" }]}>
              <Input placeholder="https://... (optional)" />
            </Form.Item>
            <Form.Item name="expiresAt" label="Expires At">
              <DatePicker showTime style={{ width: "100%" }} placeholder="Optional" />
            </Form.Item>

            <Button type="primary" icon={<SendOutlined />} onClick={handleSubmit} loading={sending}>
              Send Notification
            </Button>
          </Form>
        </Card>
      </Col>

      <Col xs={24} lg={10}>
        <Card bordered={false} className="merfit-table-card" title="Preview">
          <div
            style={{
              border: "1px solid rgba(16,24,40,0.08)",
              borderRadius: 12,
              padding: 14,
              display: "flex",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 36, height: 36, borderRadius: 9, background: "#2F6FED",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              <BellOutlined />
            </div>
            <div style={{ minWidth: 0 }}>
              <Title level={5} style={{ margin: 0 }}>{preview.title || "Notification title"}</Title>
              <Paragraph type="secondary" style={{ margin: 0, fontSize: 13 }}>
                {preview.body || "Notification body will appear here."}
              </Paragraph>
            </div>
          </div>
          <Text type="secondary" style={{ display: "block", marginTop: 12, fontSize: 12 }}>
            This is an approximation of how the push notification will look on a device.
          </Text>
        </Card>
      </Col>
    </Row>
  );
}
