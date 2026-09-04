import React, { useState } from "react";
import { Descriptions, Select, Button, Space, Skeleton, App } from "antd";
import dayjs from "dayjs";
import { DetailDrawer, StatusTag } from "../../../components/admin";
import { subscriptionService } from "../services/subscriptionsService";

const STATUSES = ["Active", "Expired", "Cancelled", "Refunded", "Paused", "GracePeriod"];
const STATUS_LABELS = {
  Active: "Aktif",
  Expired: "Süresi Doldu",
  Cancelled: "İptal Edildi",
  Refunded: "İade Edildi",
  Paused: "Duraklatıldı",
  GracePeriod: "Ek Süre",
};

export default function SubscriptionDetailDrawer({ open, subscription, loading, onClose, onChanged }) {
  const { message } = App.useApp();
  const [nextStatus, setNextStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!nextStatus || !subscription) return;
    setSaving(true);
    try {
      await subscriptionService.updateStatus(subscription.id, { status: nextStatus });
      message.success(`Abonelik durumu "${STATUS_LABELS[nextStatus] ?? nextStatus}" olarak ayarlandı.`);
      setNextStatus(null);
      onChanged?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <DetailDrawer open={open} title="Abonelik Detayı" onClose={onClose}>
      {loading || !subscription ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <>
          <Descriptions column={1} bordered size="small" style={{ marginBottom: 20 }}>
            <Descriptions.Item label="Kullanıcı">{subscription.userEmail}</Descriptions.Item>
            <Descriptions.Item label="Ürün">{subscription.productName}</Descriptions.Item>
            <Descriptions.Item label="Sağlayıcı">{subscription.provider}</Descriptions.Item>
            <Descriptions.Item label="Durum">
              <StatusTag status={subscription.status}>{STATUS_LABELS[subscription.status] ?? subscription.status}</StatusTag>
            </Descriptions.Item>
            <Descriptions.Item label="Başlangıç Tarihi">{dayjs(subscription.startedAt).format("DD MMM YYYY")}</Descriptions.Item>
            <Descriptions.Item label="Bitiş Tarihi">
              {subscription.expiresAt ? dayjs(subscription.expiresAt).format("DD MMM YYYY") : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Otomatik Yenileme">{subscription.autoRenew ? "Evet" : "Hayır"}</Descriptions.Item>
            <Descriptions.Item label="İptal Tarihi">
              {subscription.cancelledAt ? dayjs(subscription.cancelledAt).format("DD MMM YYYY") : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Harici İşlem Kimliği">
              {subscription.externalTransactionId}
            </Descriptions.Item>
          </Descriptions>

          <Space.Compact style={{ width: "100%" }}>
            <Select
              style={{ flex: 1 }}
              placeholder="Durumu değiştir..."
              value={nextStatus}
              onChange={setNextStatus}
              options={STATUSES.filter((s) => s !== subscription.status).map((s) => ({ value: s, label: STATUS_LABELS[s] ?? s }))}
            />
            <Button type="primary" disabled={!nextStatus} loading={saving} onClick={handleSave}>
              Kaydet
            </Button>
          </Space.Compact>
        </>
      )}
    </DetailDrawer>
  );
}
