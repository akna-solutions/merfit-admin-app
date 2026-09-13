import React, { useState } from "react";
import { Form, Input, Select, Button, App } from "antd";
import { SectionCard } from "../../../components/admin";

// There is no AdminSettingsController in the API yet — admin panel
// preferences like these aren't persisted server-side anywhere. This tab
// is local mock state only, exactly as the original spec calls for
// ("Bu aşamada gerçek backend işlemi gerekmiyor. Mock state yeterli.").
export default function GeneralSettingsTab() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    form.validateFields().then(() => {
      setSaving(true);
      setTimeout(() => {
        setSaving(false);
        message.success("Genel ayarlar kaydedildi (mock — henüz backend yok).");
      }, 400);
    });
  };

  return (
    <SectionCard>
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: 480 }}
        initialValues={{ appName: "MB Fit Admin", defaultLanguage: "tr", timezone: "Europe/Istanbul" }}
      >
        <Form.Item name="appName" label="Uygulama Adı" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="defaultLanguage" label="Varsayılan Dil">
          <Select
            options={[
              { value: "tr", label: "Türkçe" },
              { value: "en", label: "İngilizce" },
              { value: "de", label: "Almanca" },
            ]}
          />
        </Form.Item>
        <Form.Item name="timezone" label="Saat Dilimi">
          <Select
            options={[
              { value: "Europe/Istanbul", label: "Europe/Istanbul (UTC+3)" },
              { value: "Europe/London", label: "Europe/London (UTC+0)" },
              { value: "America/New_York", label: "America/New York (UTC-5)" },
            ]}
          />
        </Form.Item>
        <Button type="primary" loading={saving} onClick={handleSave}>
          Değişiklikleri Kaydet
        </Button>
      </Form>
    </SectionCard>
  );
}
