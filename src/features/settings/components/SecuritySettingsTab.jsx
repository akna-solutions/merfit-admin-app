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
        <Form.Item label="Oturum Zaman Aşımı (dakika)">
          <InputNumber
            style={{ width: "100%" }}
            min={5}
            max={480}
            value={sessionTimeout}
            onChange={(value) => {
              setSessionTimeout(value);
              message.info("Kaydedildi (mock — henüz backend yok).");
            }}
          />
        </Form.Item>
        <Form.Item
          label={
            <span>
              Çok Faktörlü Kimlik Doğrulama Zorunlu{" "}
              <Tooltip title="Çok faktörlü kimlik doğrulama zorunluluğu API'de henüz uygulanmadı.">
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
