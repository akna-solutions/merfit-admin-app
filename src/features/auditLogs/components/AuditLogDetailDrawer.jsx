import React from "react";
import { Descriptions, Tag, Skeleton, Row, Col, Typography, Empty } from "antd";
import dayjs from "dayjs";
import { DetailDrawer } from "../../../components/admin";

const { Text } = Typography;

// Kod değerleri API ile birebir eşleşir — yalnızca gösterilen etiketler Türkçeleştirilir.
const ACTION_LABELS = {
  Create: "Oluşturma",
  Update: "Güncelleme",
  Delete: "Silme",
  StatusChange: "Durum Değişikliği",
  Login: "Giriş",
  Publish: "Yayınlama",
};

const ENTITY_LABELS = {
  User: "Kullanıcı",
  Workout: "Antrenman",
  Food: "Besin",
  SubscriptionProduct: "Abonelik Ürünü",
  Content: "İçerik",
  Faq: "SSS",
  Achievement: "Başarı",
  SupportTicket: "Destek Talebi",
};

function JsonBlock({ value }) {
  if (!value) return <Empty description="Veri yok" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  return (
    <pre
      style={{
        background: "rgba(16,24,40,0.03)",
        padding: 10,
        borderRadius: 8,
        fontSize: 12,
        overflow: "auto",
        maxHeight: 260,
        margin: 0,
      }}
    >
      {value}
    </pre>
  );
}

export default function AuditLogDetailDrawer({ open, log, loading, onClose }) {
  return (
    <DetailDrawer open={open} title={log ? `Denetim Kaydı #${log.id}` : "Denetim Kaydı"} width={600} onClose={onClose}>
      {loading || !log ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <>
          <Descriptions column={1} bordered size="small" style={{ marginBottom: 16 }}>
            <Descriptions.Item label="Zaman Damgası">{dayjs(log.createdAt).format("DD MMM YYYY, HH:mm:ss")}</Descriptions.Item>
            <Descriptions.Item label="Yönetici">{log.adminEmail ?? <Text type="secondary">Sistem</Text>}</Descriptions.Item>
            <Descriptions.Item label="İşlem"><Tag color="blue">{ACTION_LABELS[log.action] ?? log.action}</Tag></Descriptions.Item>
            <Descriptions.Item label="Varlık">{ENTITY_LABELS[log.entity] ?? log.entity} {log.entityId ? `#${log.entityId}` : ""}</Descriptions.Item>
            <Descriptions.Item label="IP Adresi">{log.ipAddress ?? "—"}</Descriptions.Item>
            <Descriptions.Item label="Kullanıcı Aracısı">
              <Text style={{ fontSize: 12 }} type="secondary">{log.userAgent ?? "—"}</Text>
            </Descriptions.Item>
          </Descriptions>

          <Row gutter={12}>
            <Col span={12}>
              <Text strong>Önce</Text>
              <div style={{ marginTop: 6 }}><JsonBlock value={log.oldValueJson} /></div>
            </Col>
            <Col span={12}>
              <Text strong>Sonra</Text>
              <div style={{ marginTop: 6 }}><JsonBlock value={log.newValueJson} /></div>
            </Col>
          </Row>
        </>
      )}
    </DetailDrawer>
  );
}
