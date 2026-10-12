import React from "react";
import { Alert, Descriptions, List, Typography, Skeleton } from "antd";

const { Text } = Typography;

/** Kitle onizlemesi: alici sayisi, aktif cihazi olanlar, ornek alicilar (token gosterilmez). */
export default function AudienceSummary({ preview, loading }) {
  if (loading) return <Skeleton active paragraph={{ rows: 2 }} />;
  if (!preview) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Descriptions size="small" column={1} bordered>
        <Descriptions.Item label="Alıcı (uygulama içi kutu)">{preview.recipientCount}</Descriptions.Item>
        <Descriptions.Item label="Aktif push cihazı olan">{preview.withActiveDeviceCount}</Descriptions.Item>
      </Descriptions>
      {preview.requiresConfirmation && (
        <Alert
          type="warning"
          showIcon
          message={`Büyük kitle: ${preview.recipientCount} kullanıcı (eşik ${preview.largeAudienceThreshold}). Gönderimden önce ayrıca onay istenecek.`}
        />
      )}
      {preview.invalidUserIds?.length > 0 && (
        <Alert
          type="error"
          showIcon
          message={`Bildirim alamayacak kullanıcı ID'leri (bulunamadı, pasif veya yönetici): ${preview.invalidUserIds.join(", ")}`}
        />
      )}
      {preview.sample?.length > 0 && (
        <List
          size="small"
          header={<Text type="secondary">Örnek alıcılar</Text>}
          dataSource={preview.sample}
          renderItem={(u) => (
            <List.Item>
              <Text>#{u.userId}</Text>
              <Text type="secondary">{[u.fullName, u.email].filter(Boolean).join(" · ")}</Text>
            </List.Item>
          )}
        />
      )}
      <Text type="secondary" style={{ fontSize: 12 }}>
        Kullanıcı tercihleri, sessiz saatler ve günlük limit gönderim anında ayrıca uygulanır; sayı bu nedenle push alacak kişi sayısından fazla olabilir.
      </Text>
    </div>
  );
}
