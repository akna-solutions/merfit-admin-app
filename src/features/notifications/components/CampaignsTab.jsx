import React, { useState } from "react";
import { Button, Col, Input, Select, Typography } from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, SendOutlined, StopOutlined, RollbackOutlined, EyeOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { SectionCard, DataTable, StatusTag, RowActions, EntityCell, FilterBar } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { notificationCampaignService } from "../services/notificationService";
import { useApiAction } from "../hooks/useApiAction";
import { useNotificationMetadata } from "../hooks/useNotificationMetadata";
import { CAMPAIGN_STATUS_LABELS, SEGMENT_LABELS, NOTIFICATION_TYPE_LABELS, STATUS_COLORS, label, toOptions } from "../utils/notificationLabels";
import CampaignFormDrawer from "./CampaignFormDrawer";
import ScheduleCampaignModal from "./ScheduleCampaignModal";
import CampaignDetailDrawer from "./CampaignDetailDrawer";

const { Text } = Typography;
const CANCELLABLE = ["Draft", "Scheduled", "Processing", "Dispatching", "Failed"];

export default function CampaignsTab() {
  const run = useApiAction();
  const { metadata } = useNotificationMetadata();
  const { rows, total, loading, filters, page, pageSize, setPage, setPageSize, updateFilters, resetFilters, refetch } =
    useListQuery(notificationCampaignService.getCampaigns, { search: "", status: undefined });
  const [formState, setFormState] = useState({ open: false, campaign: null });
  const [submitting, setSubmitting] = useState(false);
  const [scheduleCampaign, setScheduleCampaign] = useState(null);
  const [detailId, setDetailId] = useState(null);

  const openEdit = async (record) => {
    const res = await run(() => notificationCampaignService.getCampaign(record.id));
    if (res) setFormState({ open: true, campaign: res.data });
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    const res = formState.campaign
      ? await run(() => notificationCampaignService.updateCampaign(formState.campaign.id, values), "Taslak güncellendi.")
      : await run(() => notificationCampaignService.createCampaign(values), "Taslak oluşturuldu. Göndermek için \"Gönder / Zamanla\" seçin.");
    setSubmitting(false);
    if (res) {
      setFormState({ open: false, campaign: null });
      refetch();
    }
  };

  const action = async (fn, msg) => {
    if (await run(fn, msg)) refetch();
  };

  const columns = [
    {
      title: "Kampanya",
      key: "name",
      width: 280,
      render: (_, r) => <EntityCell title={r.name} subtitle={r.title} avatarColor="#F59E0B" />,
    },
    { title: "Tür", dataIndex: "type", key: "type", width: 130, render: (v) => label(NOTIFICATION_TYPE_LABELS, v) },
    { title: "Kitle", dataIndex: "segment", key: "segment", width: 200, render: (v) => label(SEGMENT_LABELS, v) },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      width: 170,
      render: (v) => <StatusTag status={v} colorMap={STATUS_COLORS}>{label(CAMPAIGN_STATUS_LABELS, v)}</StatusTag>,
    },
    { title: "Alıcı", dataIndex: "recipientCount", key: "recipientCount", width: 90, render: (v) => v ?? <Text type="secondary">—</Text> },
    {
      title: "Zamanlama",
      dataIndex: "scheduledAtUtc",
      key: "scheduledAtUtc",
      width: 150,
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY, HH:mm") : <Text type="secondary">—</Text>),
    },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, r) => (
        <RowActions
          items={[
            { key: "view", label: "Detay ve Sonuçlar", icon: <EyeOutlined />, onClick: () => setDetailId(r.id) },
            ...(r.status === "Draft"
              ? [
                  { key: "send", label: "Gönder / Zamanla", icon: <SendOutlined />, onClick: () => setScheduleCampaign(r) },
                  { key: "edit", label: "Düzenle", icon: <EditOutlined />, onClick: () => openEdit(r) },
                ]
              : []),
            ...(r.status === "Scheduled"
              ? [{ key: "unschedule", label: "Taslağa Al", icon: <RollbackOutlined />, onClick: () => action(() => notificationCampaignService.unschedule(r.id), "Kampanya taslağa alındı.") }]
              : []),
            ...(CANCELLABLE.includes(r.status)
              ? [{
                  key: "cancel",
                  label: "İptal Et",
                  icon: <StopOutlined />,
                  danger: true,
                  confirm: "Kampanya iptal edilsin mi? Henüz gönderilmemiş bildirimler gönderilmez.",
                  onClick: () => action(() => notificationCampaignService.cancel(r.id), "Kampanya iptal edildi."),
                }]
              : []),
            ...(r.status === "Draft"
              ? [{ key: "delete", label: "Sil", icon: <DeleteOutlined />, danger: true, confirm: `"${r.name}" silinsin mi?`, onClick: () => action(() => notificationCampaignService.deleteCampaign(r.id), "Taslak silindi.") }]
              : []),
          ]}
        />
      ),
    },
  ];

  return (
    <div className="mbfit-page" style={{ gap: 16 }}>
      <FilterBar
        onReset={resetFilters}
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, campaign: null })}>Yeni Kampanya</Button>}
      >
        <Col xs={24} sm={12} lg={8}>
          <Input allowClear prefix={<SearchOutlined />} placeholder="Ad veya başlıkta ara" value={filters.search} onChange={(e) => updateFilters({ search: e.target.value })} />
        </Col>
        <Col xs={12} sm={6} lg={5}>
          <Select allowClear style={{ width: "100%" }} placeholder="Durum" value={filters.status} onChange={(status) => updateFilters({ status })} options={toOptions(CAMPAIGN_STATUS_LABELS)} />
        </Col>
      </FilterBar>
      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={1100}
          emptyDescription="Henüz kampanya yok."
          onRow={(r) => ({ onClick: () => setDetailId(r.id), style: { cursor: "pointer" } })}
          pagination={{ current: page, pageSize, total, onChange: (p, s) => { setPage(p); setPageSize(s); } }}
        />
      </SectionCard>
      <CampaignFormDrawer
        open={formState.open}
        campaign={formState.campaign}
        metadata={metadata}
        submitting={submitting}
        onClose={() => setFormState({ open: false, campaign: null })}
        onSubmit={handleSubmit}
      />
      <ScheduleCampaignModal
        open={Boolean(scheduleCampaign)}
        campaign={scheduleCampaign}
        run={run}
        onClose={() => setScheduleCampaign(null)}
        onDone={() => {
          setScheduleCampaign(null);
          refetch();
        }}
      />
      <CampaignDetailDrawer open={Boolean(detailId)} campaignId={detailId} run={run} onClose={() => setDetailId(null)} onChanged={refetch} />
    </div>
  );
}
