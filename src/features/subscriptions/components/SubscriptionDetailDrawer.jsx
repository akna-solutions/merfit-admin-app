import React, { useState } from "react";
import { Descriptions, Select, Button, Space, Skeleton, App } from "antd";
import dayjs from "dayjs";
import { DetailDrawer, StatusTag } from "../../../components/admin";
import { subscriptionService } from "../services/subscriptionsService";

const STATUSES = ["Active", "Expired", "Cancelled", "Refunded", "Paused", "GracePeriod"];

export default function SubscriptionDetailDrawer({ open, subscription, loading, onClose, onChanged }) {
  const { message } = App.useApp();
  const [nextStatus, setNextStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!nextStatus || !subscription) return;
    setSaving(true);
    try {
      await subscriptionService.updateStatus(subscription.id, { status: nextStatus });
      message.success(`Subscription status set to ${nextStatus}.`);
      setNextStatus(null);
      onChanged?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <DetailDrawer open={open} title="Subscription Detail" onClose={onClose}>
      {loading || !subscription ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <>
          <Descriptions column={1} bordered size="small" style={{ marginBottom: 20 }}>
            <Descriptions.Item label="User">{subscription.userEmail}</Descriptions.Item>
            <Descriptions.Item label="Product">{subscription.productName}</Descriptions.Item>
            <Descriptions.Item label="Provider">{subscription.provider}</Descriptions.Item>
            <Descriptions.Item label="Status"><StatusTag status={subscription.status} /></Descriptions.Item>
            <Descriptions.Item label="Started At">{dayjs(subscription.startedAt).format("DD MMM YYYY")}</Descriptions.Item>
            <Descriptions.Item label="Expires At">
              {subscription.expiresAt ? dayjs(subscription.expiresAt).format("DD MMM YYYY") : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Auto Renew">{subscription.autoRenew ? "Yes" : "No"}</Descriptions.Item>
            <Descriptions.Item label="Cancelled At">
              {subscription.cancelledAt ? dayjs(subscription.cancelledAt).format("DD MMM YYYY") : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="External Transaction ID">
              {subscription.externalTransactionId}
            </Descriptions.Item>
          </Descriptions>

          <Space.Compact style={{ width: "100%" }}>
            <Select
              style={{ flex: 1 }}
              placeholder="Change status to..."
              value={nextStatus}
              onChange={setNextStatus}
              options={STATUSES.filter((s) => s !== subscription.status).map((s) => ({ value: s, label: s }))}
            />
            <Button type="primary" disabled={!nextStatus} loading={saving} onClick={handleSave}>
              Save
            </Button>
          </Space.Compact>
        </>
      )}
    </DetailDrawer>
  );
}
