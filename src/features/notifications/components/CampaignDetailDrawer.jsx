import React, { useCallback, useEffect, useState } from "react";
import { Descriptions, Row, Col, Statistic, Card, Button, Space, Typography, Skeleton, Tag } from "antd";
import { RedoOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { DetailDrawer, StatusTag } from "../../../components/admin";
import { notificationCampaignService } from "../services/notificationService";
import {
  CAMPAIGN_STATUS_LABELS, SEGMENT_LABELS, NOTIFICATION_TYPE_LABELS, DISPATCH_STATUS_LABELS, DELIVERY_STATUS_LABELS, STATUS_COLORS, label,
} from "../utils/notificationLabels";
import { SCREEN_LABELS, dataJsonToScreen } from "../utils/notificationForm";
import DispatchTable from "./DispatchTable";

const { Text, Paragraph } = Typography;
const fmt = (v) => (v ? dayjs(v).format("DD MMM YYYY, HH:mm") : "—");

/** Kampanya detayi, teslim istatistikleri ve alici sonuclari. */
export default function CampaignDetailDrawer({ open, campaignId, onClose, onChanged, run }) {
  const [campaign, setCampaign] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tableKey, setTableKey] = useState(0);

  const load = useCallback(async () => {
    if (!campaignId) return;
    setLoading(true);
    const [detail, statsRes] = await Promise.all([
      run(() => notificationCampaignService.getCampaign(campaignId)),
      run(() => notificationCampaignService.getStats(campaignId)),
    ]);
    if (detail) setCampaign(detail.data);
    if (statsRes) setStats(statsRes.data);
    setLoading(false);
  }, [campaignId, run]);

  useEffect(() => {
    if (open) load();
    else {
      setCampaign(null);
      setStats(null);
    }
  }, [open, load]);

  const failed = stats?.dispatchStatusCounts?.Failed ?? 0;
  const canRetry = campaign && (campaign.status === "Failed" || (failed > 0 && ["Dispatching", "Completed"].includes(campaign.status)));

  const handleRetry = async () => {
    const res = await run(
      () => notificationCampaignService.retryFailed(campaignId),
      (r) => `${r.data.retriedCount} gönderim yeniden kuyruğa alındı${r.data.skippedCount ? `, ${r.data.skippedCount} atlandı (süresi dolmuş)` : ""}.`,
    );
    if (res) {
      await load();
      setTableKey((k) => k + 1);
      onChanged?.();
    }
  };

  const refresh = async () => {
    await load();
    setTableKey((k) => k + 1);
  };

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      width={1040}
      title={campaign ? campaign.name : "Kampanya"}
      extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={refresh}>Yenile</Button>
          {canRetry && <Button icon={<RedoOutlined />} onClick={handleRetry}>Başarısızları Yeniden Dene</Button>}
        </Space>
      }
    >
      {loading && !campaign ? (
        <Skeleton active />
      ) : campaign ? (
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Descriptions size="small" column={1} bordered>
                <Descriptions.Item label="Durum">
                  <StatusTag status={campaign.status} colorMap={STATUS_COLORS}>{label(CAMPAIGN_STATUS_LABELS, campaign.status)}</StatusTag>
                </Descriptions.Item>
                <Descriptions.Item label="Tür">{label(NOTIFICATION_TYPE_LABELS, campaign.type)}</Descriptions.Item>
                <Descriptions.Item label="Kitle">
                  {label(SEGMENT_LABELS, campaign.segment)}
                  {campaign.userIds?.length > 0 && ` (${campaign.userIds.length} kullanıcı)`}
                </Descriptions.Item>
                <Descriptions.Item label="Zamanlama">{fmt(campaign.scheduledAtUtc)}</Descriptions.Item>
                <Descriptions.Item label="Başlangıç">{fmt(campaign.startedAtUtc)}</Descriptions.Item>
                <Descriptions.Item label="Bitiş">{fmt(campaign.completedAtUtc ?? campaign.cancelledAtUtc)}</Descriptions.Item>
                <Descriptions.Item label="Son geçerlilik">{fmt(campaign.expiresAtUtc)}</Descriptions.Item>
                {campaign.lastError && <Descriptions.Item label="Son hata"><Text type="danger">{campaign.lastError}</Text></Descriptions.Item>}
              </Descriptions>
            </Col>
            <Col xs={24} md={12}>
              <Card size="small" title="Mesaj">
                <Text strong>{campaign.title}</Text>
                <Paragraph type="secondary">{campaign.body}</Paragraph>
                {dataJsonToScreen(campaign.dataJson) && <Tag color="blue">Ekran: {SCREEN_LABELS[dataJsonToScreen(campaign.dataJson)]}</Tag>}
              </Card>
            </Col>
          </Row>

          {stats && (
            <Row gutter={[12, 12]}>
              <Col xs={12} md={6}><Card size="small"><Statistic title="Alıcı" value={stats.recipientCount ?? 0} /></Card></Col>
              <Col xs={12} md={6}><Card size="small"><Statistic title="Kuyrukta" value={stats.queuedCount} /></Card></Col>
              <Col xs={12} md={6}><Card size="small"><Statistic title="Uygulama içi" value={stats.inboxCount} /></Card></Col>
              <Col xs={12} md={6}><Card size="small"><Statistic title="Okundu" value={stats.readCount} /></Card></Col>
              <Col span={24}>
                <Space wrap>
                  {Object.entries(stats.dispatchStatusCounts).map(([k, v]) => (
                    <StatusTag key={k} status={k} colorMap={STATUS_COLORS}>{`${label(DISPATCH_STATUS_LABELS, k)}: ${v}`}</StatusTag>
                  ))}
                  {Object.entries(stats.deliveryStatusCounts).map(([k, v]) => (
                    <Tag key={k}>{`${label(DELIVERY_STATUS_LABELS, k)}: ${v}`}</Tag>
                  ))}
                </Space>
              </Col>
            </Row>
          )}

          <DispatchTable key={tableKey} fixedFilters={{ campaignId: campaign.id, source: "Campaign" }} onChanged={load} />
        </Space>
      ) : null}
    </DetailDrawer>
  );
}
