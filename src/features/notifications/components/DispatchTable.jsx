import React, { useState } from "react";
import { Col, Select, Input, InputNumber, Typography } from "antd";
import { SearchOutlined, RedoOutlined, EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { DataTable, FilterBar, StatusTag, RowActions, EntityCell } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { notificationDispatchService } from "../services/notificationService";
import { useApiAction } from "../hooks/useApiAction";
import DispatchDetailDrawer from "./DispatchDetailDrawer";
import {
  DISPATCH_STATUS_LABELS, DISPATCH_SOURCE_LABELS, DISPATCH_REASON_LABELS, STATUS_COLORS, SOURCES_BY_APP, label, toOptions,
} from "../utils/notificationLabels";

const { Text } = Typography;

/**
 * Gonderim kayitlari (alici sonuclari). fixedFilters ile bir kampanya, kural veya doneme sabitlenebilir.
 * Basarisiz kayitlar tek tek yeniden denenebilir.
 */
export default function DispatchTable({ fixedFilters = {}, showSourceFilter = false, app, onChanged }) {
  const run = useApiAction();
  const [openId, setOpenId] = useState(null);
  const defaults = { status: undefined, source: undefined, userId: undefined, search: "", ...fixedFilters };
  const { rows, total, loading, filters, page, pageSize, setPage, setPageSize, updateFilters, resetFilters, refetch } =
    useListQuery(notificationDispatchService.getDispatches, defaults);

  const handleRetry = async (record) => {
    const ok = await run(() => notificationDispatchService.retry(record.id), "Gönderim yeniden kuyruğa alındı.");
    if (ok) {
      refetch();
      onChanged?.();
    }
  };

  const columns = [
    { title: "Kullanıcı", key: "user", width: 220, render: (_, r) => <EntityCell title={r.userEmail} subtitle={`#${r.userId}`} /> },
    { title: "Başlık", dataIndex: "title", key: "title", width: 240, ellipsis: true },
    ...(showSourceFilter ? [{ title: "Kaynak", dataIndex: "source", key: "source", width: 110, render: (v) => label(DISPATCH_SOURCE_LABELS, v) }] : []),
    {
      title: "Durum",
      key: "status",
      width: 230,
      render: (_, r) => (
        <div>
          <StatusTag status={r.status} colorMap={STATUS_COLORS}>{label(DISPATCH_STATUS_LABELS, r.status)}</StatusTag>
          {r.statusReason && <div><Text type="secondary" style={{ fontSize: 12 }}>{label(DISPATCH_REASON_LABELS, r.statusReason)}</Text></div>}
        </div>
      ),
    },
    { title: "Deneme", dataIndex: "attemptCount", key: "attemptCount", width: 80 },
    { title: "Son hata", dataIndex: "lastError", key: "lastError", width: 200, ellipsis: true, render: (v) => v ?? <Text type="secondary">—</Text> },
    { title: "İşlenme", dataIndex: "processedAtUtc", key: "processedAtUtc", width: 150, render: (v) => (v ? dayjs(v).format("DD MMM, HH:mm") : <Text type="secondary">—</Text>) },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, r) => (
        <RowActions
          items={[
            { key: "view", label: "Detay", icon: <EyeOutlined />, onClick: () => setOpenId(r.id) },
            ...(r.status === "Failed"
              ? [{ key: "retry", label: "Yeniden Dene", icon: <RedoOutlined />, confirm: "Bu gönderim yeniden denensin mi?", onClick: () => handleRetry(r) }]
              : []),
          ]}
        />
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <FilterBar onReset={resetFilters}>
        <Col xs={24} sm={12} lg={7}>
          <Input
            allowClear
            placeholder="E-posta ile ara"
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </Col>
        <Col xs={12} sm={6} lg={5}>
          <Select
            allowClear
            style={{ width: "100%" }}
            placeholder="Durum"
            value={filters.status}
            onChange={(status) => updateFilters({ status })}
            options={toOptions(DISPATCH_STATUS_LABELS)}
          />
        </Col>
        {showSourceFilter && (
          <Col xs={12} sm={6} lg={4}>
            <Select
              allowClear
              style={{ width: "100%" }}
              placeholder="Kaynak"
              value={filters.source}
              onChange={(source) => updateFilters({ source })}
              options={toOptions(DISPATCH_SOURCE_LABELS, app ? SOURCES_BY_APP[app] : undefined)}
            />
          </Col>
        )}
        <Col xs={12} sm={6} lg={4}>
          <InputNumber
            style={{ width: "100%" }}
            min={1}
            placeholder="Kullanıcı ID"
            value={filters.userId}
            onChange={(userId) => updateFilters({ userId: userId ?? undefined })}
          />
        </Col>
      </FilterBar>
      <DataTable
        columns={columns}
        dataSource={rows}
        loading={loading}
        scrollX={1200}
        emptyDescription="Gönderim kaydı yok."
        onRow={(r) => ({ onClick: () => setOpenId(r.id), style: { cursor: "pointer" } })}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: (nextPage, nextPageSize) => {
            setPage(nextPage);
            setPageSize(nextPageSize);
          },
        }}
      />
      <DispatchDetailDrawer
        open={Boolean(openId)}
        dispatchId={openId}
        onClose={() => setOpenId(null)}
        onChanged={() => {
          refetch();
          onChanged?.();
        }}
      />
    </div>
  );
}
