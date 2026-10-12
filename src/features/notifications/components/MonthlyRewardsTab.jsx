import React, { useState } from "react";
import { Alert, Col, Select, Space, Typography, Tag } from "antd";
import { SendOutlined, RedoOutlined, UnorderedListOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { SectionCard, DataTable, StatusTag, RowActions, FilterBar, DetailDrawer } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { monthlyRewardNotificationService } from "../services/notificationService";
import { useApiAction } from "../hooks/useApiAction";
import { monthLabel } from "../utils/notificationForm";
import { MONTHLY_RUN_STATUS_LABELS, DISPATCH_STATUS_LABELS, STATUS_COLORS, label, toOptions } from "../utils/notificationLabels";
import DispatchTable from "./DispatchTable";

const { Text } = Typography;

/**
 * Aylik MB FIT Puan odul bildirimleri. Is, siralamadan "odul dagit" yapildiginda otomatik kuyruga alinir ve
 * donem bittikten sonra islenir. Buradan elle tetiklenebilir veya yeniden denenebilir; ayni kullaniciya ayni
 * donem icin ikinci bildirim gitmez. Puan/odul hesaplamasi degismez.
 */
export default function MonthlyRewardsTab() {
  const run = useApiAction();
  const { rows, total, loading, filters, page, pageSize, setPage, setPageSize, updateFilters, resetFilters, refetch } =
    useListQuery(monthlyRewardNotificationService.getRuns, { status: undefined });
  const [dispatchPeriod, setDispatchPeriod] = useState(null);

  const trigger = async (r) => {
    if (await run(() => monthlyRewardNotificationService.trigger(r.leaderboardPeriodId), "Ödül bildirimleri kuyruğa alındı.")) refetch();
  };

  const columns = [
    {
      title: "Dönem",
      key: "period",
      width: 220,
      render: (_, r) => (
        <div>
          <Text strong>{monthLabel(dayjs(r.periodStartDate).add(15, "day").toISOString())}</Text>
          <div><Text type="secondary" style={{ fontSize: 12 }}>{`${dayjs(r.periodStartDate).format("DD.MM.YYYY")} – ${dayjs(r.periodEndDate).format("DD.MM.YYYY")}`}</Text></div>
        </div>
      ),
    },
    { title: "Ödül", dataIndex: "rewardCount", key: "rewardCount", width: 80, render: (v) => v || <Text type="secondary">Dağıtılmadı</Text> },
    {
      title: "Durum",
      key: "status",
      width: 200,
      render: (_, r) => (
        <Space direction="vertical" size={0}>
          <StatusTag status={r.status} colorMap={STATUS_COLORS}>{label(MONTHLY_RUN_STATUS_LABELS, r.status)}</StatusTag>
          {r.waitingForPeriodEnd && r.status === "Pending" && <Text type="secondary" style={{ fontSize: 12 }}>Dönem bitince gönderilecek</Text>}
          {r.lastError && <Text type="danger" style={{ fontSize: 12 }}>{r.lastError}</Text>}
        </Space>
      ),
    },
    { title: "Kazanan", dataIndex: "recipientCount", key: "recipientCount", width: 90, render: (v) => v ?? <Text type="secondary">—</Text> },
    {
      title: "Gönderimler",
      key: "dispatches",
      width: 280,
      render: (_, r) =>
        Object.keys(r.dispatchStatusCounts).length ? (
          <Space wrap size={4}>
            {Object.entries(r.dispatchStatusCounts).map(([k, v]) => <Tag key={k}>{`${label(DISPATCH_STATUS_LABELS, k)}: ${v}`}</Tag>)}
          </Space>
        ) : <Text type="secondary">—</Text>,
    },
    { title: "Tamamlanma", dataIndex: "completedAtUtc", key: "completedAtUtc", width: 150, render: (v) => (v ? dayjs(v).format("DD MMM YYYY, HH:mm") : <Text type="secondary">—</Text>) },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, r) => (
        <RowActions
          items={[
            ...(r.rewardCount > 0 && r.status !== "Processing" && r.status !== "Pending"
              ? [{
                  key: "trigger",
                  label: r.status === "NotQueued" ? "Bildirimleri Gönder" : "Yeniden Çalıştır",
                  icon: r.status === "NotQueued" ? <SendOutlined /> : <RedoOutlined />,
                  confirm: "Ödül bildirimleri kuyruğa alınsın mı? Daha önce bildirim alan kazananlara tekrar gönderilmez.",
                  onClick: () => trigger(r),
                }]
              : []),
            { key: "dispatches", label: "Gönderimler", icon: <UnorderedListOutlined />, onClick: () => setDispatchPeriod(r) },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="mbfit-page" style={{ gap: 16 }}>
      <Alert
        type="info"
        showIcon
        message="Sıralamada “Ödülleri Dağıt” yapıldığında aylık dönemin bildirim işi otomatik kuyruğa alınır ve dönem bittikten sonra kazananlara gönderilir. Puan ve ödül hesaplaması değişmez."
      />
      <FilterBar onReset={resetFilters}>
        <Col xs={12} sm={6} lg={5}>
          <Select allowClear style={{ width: "100%" }} placeholder="Durum" value={filters.status} onChange={(status) => updateFilters({ status })} options={toOptions(MONTHLY_RUN_STATUS_LABELS, ["Pending", "Processing", "Completed", "Failed"])} />
        </Col>
      </FilterBar>
      <SectionCard>
        <DataTable
          rowKey="leaderboardPeriodId"
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={1100}
          emptyDescription="Aylık sıralama dönemi yok."
          pagination={{ current: page, pageSize, total, onChange: (p, s) => { setPage(p); setPageSize(s); } }}
        />
      </SectionCard>
      <DetailDrawer
        open={Boolean(dispatchPeriod)}
        width={1000}
        title={dispatchPeriod ? `${monthLabel(dayjs(dispatchPeriod.periodStartDate).add(15, "day").toISOString())} ödül bildirimleri` : ""}
        onClose={() => setDispatchPeriod(null)}
      >
        {dispatchPeriod && <DispatchTable fixedFilters={{ leaderboardPeriodId: dispatchPeriod.leaderboardPeriodId, source: "MonthlyReward" }} onChanged={refetch} />}
      </DetailDrawer>
    </div>
  );
}
