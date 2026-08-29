import React, { useState } from "react";
import { Form, InputNumber, Switch, Tooltip, App } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { SectionCard } from "../../../components/admin";

export default function SecuritySettingsTab() {
  const { message } = App.useApp();
  const [sessionTimeout, setSessionTimeout] = useState(30);

  return (
    <SectionCard>
      <Form layout="vertical" style={{ maxWidth: 480 }}>
        <Form.Item label="Session Timeout (minutes)">
          <InputNumber
            style={{ width: "100%" }}
            min={5}
            max={480}
            value={sessionTimeout}
            onChange={(value) => {
              setSessionTimeout(value);
              message.info("Saved (mock — no backend yet).");
            }}
          />
        </Form.Item>
        <Form.Item
          label={
            <span>
              Require MFA{" "}
              <Tooltip title="Multi-factor authentication enforcement isn't implemented in the API yet.">
                <InfoCircleOutlined style={{ color: "#98A2B3" }} />
              </Tooltip>
            </span>
          }
        >
          <Switch disabled checked={false} />
        </Form.Item>
      </Form>
    </SectionCard>
  );
}
