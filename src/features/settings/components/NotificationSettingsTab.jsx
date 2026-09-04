import React, { useState } from "react";
import { Form, Switch, App } from "antd";
import { SectionCard } from "../../../components/admin";

export default function NotificationSettingsTab() {
  const { message } = App.useApp();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [systemNotifications, setSystemNotifications] = useState(true);

  const handleToggle = (setter) => (checked) => {
    setter(checked);
    message.info("Kaydedildi (mock — henüz backend yok).");
  };

  return (
    <SectionCard>
      <Form layout="vertical" style={{ maxWidth: 480 }}>
        <Form.Item label="E-posta Bildirimleri" extra="Yönetici uyarılarını ve raporlarını e-posta ile alın.">
          <Switch checked={emailNotifications} onChange={handleToggle(setEmailNotifications)} />
        </Form.Item>
        <Form.Item label="Sistem Bildirimleri" extra="Kritik olaylar için uygulama içi bildirimler gösterin.">
          <Switch checked={systemNotifications} onChange={handleToggle(setSystemNotifications)} />
        </Form.Item>
      </Form>
    </SectionCard>
  );
}
