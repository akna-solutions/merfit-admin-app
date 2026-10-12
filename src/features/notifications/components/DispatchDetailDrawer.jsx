import React, { useEffect, useState, useCallback } from "react";
import { Descriptions, Table, Button, Typography, Skeleton, Space } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { DetailDrawer, StatusTag } from "../../../components/admin";
import { notificationDispatchService } from "../services/notificationService";
import { useApiAction } from "../hooks/useApiAction";
import {
  DISPATCH_STATUS_LABELS, DISPATCH_SOURCE_LABELS, DELIVERY_STATUS_LABELS, DISPATCH_REASON_LABELS,
  NOTIFICATION_TYPE_LABELS, STATUS_COLORS, label,
} from "../utils/notificationLabels";

const { Text, Paragraph } = Typography;
const fmt = (v) => (v ? dayjs(v).format("DD MMM YYYY, HH:mm:ss") : "—");

/** Tek bir gonderim kaydi ve cihaz denemeleri. Cihaz tokeni API'den hic gelmez. */
export default function DispatchDetailDrawer({ dispatchId, open, onClose, onChanged }) {
  const run = useApiAction();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (!dispatchId) return;
    setLoading(true);
    const res = await run(() => notificationDispatchService.getDispatch(dispatchId));
    if (res) setDetail(res.data);
    setLoading(false);
  }, [dispatchId, run]);

  useEffect(() => {
    if (open) load();
    else setDetail(null);
  }, [open, load]);

  const handleRetry = async () => {
    const ok = await run(() => notificationDispatchService.retry(dispatchId), "Gönderim yeniden kuyruğa alındı.");
    if (ok) {
      await load();
      onChanged?.();
    }
  };

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      width={640}
      title={detail ? `Gönderim #${detail.id}` : "Gönderim"}
      extra={
        detail?.status === "Failed" && (
          <Button icon={<RedoOutlined />} onClick={handleRetry}>Yeniden Dene</Button>
        )
      }
    >
      {loading || !detail ? (
        <Skeleton active />
      ) : (
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Descriptions size="small" column={1} bordered>
            <Descriptions.Item label="Kullanıcı">#{detail.userId} · {detail.userEmail}</Descriptions.Item>
            <Descriptions.Item label="Kaynak">
              {label(DISPATCH_SOURCE_LABELS, detail.source)}
              {detail.notificationCampaignId && ` · Kampanya #${detail.notificationCampaignId}`}
              {detail.notificationRuleId && ` · Kural #${detail.notificationRuleId}`}
              {detail.leaderboardPeriodId && ` · Dönem #${detail.leaderboardPeriodId}`}
            </Descriptions.Item>
            <Descriptions.Item label="Tür">{label(NOTIFICATION_TYPE_LABELS, detail.type)}</Descriptions.Item>
            <Descriptions.Item label="Durum">
              <StatusTag status={detail.status} colorMap={STATUS_COLORS}>{label(DISPATCH_STATUS_LABELS, detail.status)}</StatusTag>
              {detail.statusReason && <Text type="secondary">{label(DISPATCH_REASON_LABELS, detail.statusReason)}</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="Deneme">{detail.attemptCount}</Descriptions.Item>
            {detail.lastError && <Descriptions.Item label="Son hata"><Text type="danger">{detail.lastError}</Text></Descriptions.Item>}
            <Descriptions.Item label="Planlanan">{fmt(detail.scheduledForUtc)}</Descriptions.Item>
            <Descriptions.Item label="Son geçerlilik">{fmt(detail.expiresAtUtc)}</Descriptions.Item>
            <Descriptions.Item label="İşlenme">{fmt(detail.processedAtUtc)}</Descriptions.Item>
            <Descriptions.Item label="Uygulama içi kayıt">{detail.notificationId ? `#${detail.notificationId}` : "—"}</Descriptions.Item>
          </Descriptions>

          <div>
            <Text strong>{detail.title}</Text>
            <Paragraph type="secondary" style={{ marginBottom: 0 }}>{detail.body}</Paragraph>
          </div>

          <Table
            size="small"
            rowKey="id"
            pagination={false}
            dataSource={detail.attempts}
            locale={{ emptyText: "Cihaza gönderim denemesi yok." }}
            columns={[
              { title: "#", dataIndex: "attemptNumber", width: 50 },
              { title: "Cihaz", key: "device", render: (_, a) => `${a.platform}${a.deviceName ? ` · ${a.deviceName}` : ""}${a.deviceActive ? "" : " (pasif)"}` },
              {
                title: "Durum",
                dataIndex: "status",
                render: (v) => <StatusTag status={v} colorMap={STATUS_COLORS}>{label(DELIVERY_STATUS_LABELS, v)}</StatusTag>,
              },
              { title: "Hata", key: "error", render: (_, a) => (a.errorCode ? `${a.errorCode}${a.errorMessage ? `: ${a.errorMessage}` : ""}` : "—") },
              { title: "Zaman", dataIndex: "createdAt", render: fmt },
            ]}
          />
        </Space>
      )}
    </DetailDrawer>
  );
}
