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
        message.success(`Bildirim #${values.userId} numaralı kullanıcıya gönderildi.`);
      } else if (recipientType === "broadcast") {
        result = await notificationService.broadcast(payload);
        message.success(`Bildirim ${result.data.recipientCount} kullanıcıya yayınlandı.`);
      } else {
        result = await notificationService.sendToSegment({ ...payload, segment: values.segment });
        const segmentLabel = NOTIFICATION_SEGMENTS.find((s) => s.value === values.segment)?.label;
        message.success(`Bildirim, "${segmentLabel}" segmentindeki ${result.data.recipientCount} kullanıcıya gönderildi.`);
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
          ? `#${values.userId} numaralı kullanıcı`
          : recipientType === "broadcast"
            ? "TÜM kullanıcılar"
            : NOTIFICATION_SEGMENTS.find((s) => s.value === values.segment)?.label;
      modal.confirm({
        title: "Bu bildirim gönderilsin mi?",
        content: `"${values.title}" bildirimi şu alıcıya gönderilecek: ${audienceLabel}.`,
        okText: "Gönder",
        onOk: () => doSend(values),
      });
    });
  };

  return (
    <Row gutter={20}>
      <Col xs={24} lg={14}>
        <Card bordered={false} className="merfit-table-card">
          <Form form={form} layout="vertical" onValuesChange={handleValuesChange} initialValues={{ recipientType: "user" }}>
            <Form.Item label="Alıcılar">
              <Radio.Group
                value={recipientType}
                onChange={(e) => setRecipientType(e.target.value)}
                options={[
                  { value: "user", label: "Tek Kullanıcı" },
                  { value: "segment", label: "Segment" },
                  { value: "broadcast", label: "Tüm Kullanıcılar" },
                ]}
                optionType="button"
              />
            </Form.Item>

            {recipientType === "user" && (
              <Form.Item name="userId" label="Kullanıcı ID" rules={[{ required: true, message: "Kullanıcı ID zorunludur" }]}>
                <InputNumber style={{ width: "100%" }} min={1} placeholder="örn. 42" />
              </Form.Item>
            )}
            {recipientType === "segment" && (
              <Form.Item name="segment" label="Hedef Segment" rules={[{ required: true, message: "Segment zorunludur" }]}>
                <Select options={NOTIFICATION_SEGMENTS} placeholder="Bir segment seçin" />
              </Form.Item>
            )}

            <Form.Item name="title" label="Başlık" rules={[{ required: true, max: 200 }]}>
              <Input placeholder="örn. Antrenman zamanı!" />
            </Form.Item>
            <Form.Item name="body" label="İçerik" rules={[{ required: true, max: 2000 }]}>
              <Input.TextArea rows={3} placeholder="Bildirim mesajı" />
            </Form.Item>
            <Form.Item name="imageUrl" label="Görsel URL" rules={[{ type: "url" }]}>
              <Input placeholder="https://... (isteğe bağlı)" />
            </Form.Item>
            <Form.Item name="expiresAt" label="Sona Erme Tarihi">
              <DatePicker showTime style={{ width: "100%" }} placeholder="İsteğe bağlı" />
            </Form.Item>

            <Button type="primary" icon={<SendOutlined />} onClick={handleSubmit} loading={sending}>
              Bildirim Gönder
            </Button>
          </Form>
        </Card>
      </Col>

      <Col xs={24} lg={10}>
        <Card bordered={false} className="merfit-table-card" title="Önizleme">
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
              <Title level={5} style={{ margin: 0 }}>{preview.title || "Bildirim başlığı"}</Title>
              <Paragraph type="secondary" style={{ margin: 0, fontSize: 13 }}>
                {preview.body || "Bildirim içeriği burada görünecek."}
              </Paragraph>
            </div>
          </div>
          <Text type="secondary" style={{ display: "block", marginTop: 12, fontSize: 12 }}>
            Bu, push bildirimin bir cihazda nasıl görüneceğine dair yaklaşık bir gösterimdir.
          </Text>
        </Card>
      </Col>
    </Row>
  );
}
