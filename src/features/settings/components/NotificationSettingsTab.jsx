import React, { useState } from "react";
import { Form, Switch, App } from "antd";
import { SectionCard } from "../../../components/admin";

export default function NotificationSettingsTab() {
  const { message } = App.useApp();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [systemNotifications, setSystemNotifications] = useState(true);

  const handleToggle = (setter) => (checked) => {
    setter(checked);
    message.info("Saved (mock — no backend yet).");
  };

  return (
    <SectionCard>
      <Form layout="vertical" style={{ maxWidth: 480 }}>
        <Form.Item label="Email Notifications" extra="Receive admin alerts and reports by email.">
          <Switch checked={emailNotifications} onChange={handleToggle(setEmailNotifications)} />
        </Form.Item>
        <Form.Item label="System Notifications" extra="Show in-app notifications for critical events.">
          <Switch checked={systemNotifications} onChange={handleToggle(setSystemNotifications)} />
        </Form.Item>
      </Form>
    </SectionCard>
  );
}
