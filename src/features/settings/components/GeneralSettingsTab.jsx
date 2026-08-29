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
        message.success("General settings saved (mock — no backend yet).");
      }, 400);
    });
  };

  return (
    <SectionCard>
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: 480 }}
        initialValues={{ appName: "Merfit Admin", defaultLanguage: "tr", timezone: "Europe/Istanbul" }}
      >
        <Form.Item name="appName" label="App Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="defaultLanguage" label="Default Language">
          <Select
            options={[
              { value: "tr", label: "Turkish" },
              { value: "en", label: "English" },
              { value: "de", label: "German" },
            ]}
          />
        </Form.Item>
        <Form.Item name="timezone" label="Timezone">
          <Select
            options={[
              { value: "Europe/Istanbul", label: "Europe/Istanbul (UTC+3)" },
              { value: "Europe/London", label: "Europe/London (UTC+0)" },
              { value: "America/New_York", label: "America/New York (UTC-5)" },
            ]}
          />
        </Form.Item>
        <Button type="primary" loading={saving} onClick={handleSave}>
          Save Changes
        </Button>
      </Form>
    </SectionCard>
  );
}
