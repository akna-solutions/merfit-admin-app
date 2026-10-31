import React from "react";
import { Typography, Tag, Space } from "antd";
import { BellOutlined, ShoppingOutlined } from "@ant-design/icons";
import { APP_COLORS, APP_LABELS } from "../utils/notificationLabels";
import { SCREEN_LABELS } from "../utils/notificationForm";

const { Title, Paragraph, Text } = Typography;

/** Bir push bildiriminin cihazda yaklasik gorunumu. Metin sunucu onizlemesinden (ornek degerlerle) gelir. */
export default function NotificationPreviewCard({ title, body, screen, note, app = "MbFit" }) {
  return (
    <div>
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
            width: 36, height: 36, borderRadius: 9, background: APP_COLORS[app] ?? APP_COLORS.MbFit,
            color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}
        >
          {app === "MbShop" ? <ShoppingOutlined /> : <BellOutlined />}
        </div>
        <div style={{ minWidth: 0 }}>
          <Title level={5} style={{ margin: 0 }}>{title || "Bildirim başlığı"}</Title>
          <Paragraph type="secondary" style={{ margin: 0, fontSize: 13 }}>
            {body || "Bildirim içeriği burada görünecek."}
          </Paragraph>
        </div>
      </div>
      <Space size={6} style={{ marginTop: 8 }} wrap>
        <Tag color={app === "MbShop" ? "orange" : "geekblue"}>{APP_LABELS[app] ?? app} bildirim kutusu</Tag>
        {screen && <Tag color="blue">Açılacak ekran: {SCREEN_LABELS[screen] ?? screen}</Tag>}
        {note && <Text type="secondary" style={{ fontSize: 12 }}>{note}</Text>}
      </Space>
    </div>
  );
}
