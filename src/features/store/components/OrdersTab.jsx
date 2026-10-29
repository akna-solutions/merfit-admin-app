import React, { useState } from "react";
import { Col, DatePicker, Input, Select, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { DataTable, FilterBar, SectionCard, StatusTag } from "../../../components/admin";
import { useSafeListQuery } from "../hooks/useSafeListQuery";
import { storeOrderService } from "../services/storeService";
import { orderFiltersToQuery } from "../utils/storeForms";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
  formatMoney,
} from "../utils/storeLabels";
import ListError from "./ListError";
import OrderDetailDrawer from "./OrderDetailDrawer";

const DEFAULT_FILTERS = { search: "", status: undefined, paymentStatus: undefined, paymentMethod: undefined, dateRange: undefined };

const toOptions = (labels, allLabel) => [{ value: "all", label: allLabel }, ...Object.entries(labels).map(([value, label]) => ({ value, label }))];

export default function OrdersTab() {
  const { rows, total, loading, error, filters, page, pageSize, setPage, setPageSize, updateFilters, resetFilters, refetch } = useSafeListQuery(
    storeOrderService.getOrders,
    DEFAULT_FILTERS,
    20,
    orderFiltersToQuery,
  );
  const [openId, setOpenId] = useState(null);

  const columns = [
    {
      title: "Sipariş",
      key: "orderNumber",
      width: 200,
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600 }}>{r.orderNumber}</div>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {dayjs(r.createdAt).format("DD MMM YYYY HH:mm")}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Müşteri",
      key: "customer",
      width: 220,
      render: (_, r) => (
        <div>
          <div>{r.recipientName ?? "—"}</div>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {r.userEmail ?? `#${r.userId}`}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Durum",
      dataIndex: "status",
      width: 130,
      render: (v) => (
        <StatusTag status={v} colorMap={ORDER_STATUS_COLORS}>
          {ORDER_STATUS_LABELS[v] ?? v}
        </StatusTag>
      ),
    },
    {
      title: "Ödeme",
      key: "payment",
      width: 200,
      render: (_, r) => (
        <div>
          <StatusTag status={r.paymentStatus} colorMap={PAYMENT_STATUS_COLORS}>
            {PAYMENT_STATUS_LABELS[r.paymentStatus] ?? r.paymentStatus}
          </StatusTag>
          <div>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {PAYMENT_METHOD_LABELS[r.paymentMethod] ?? r.paymentMethod}
            </Typography.Text>
          </div>
        </div>
      ),
    },
    { title: "Ürün", dataIndex: "itemCount", width: 70 },
    { title: "Tutar", dataIndex: "totalAmount", width: 130, render: formatMoney },
  ];

  return (
    <>
      <FilterBar onReset={resetFilters}>
        <Col xs={24} sm={12} lg={6}>
          <Input
            allowClear
            placeholder="Sipariş no veya müşteri e-postası"
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Select
            style={{ width: "100%" }}
            value={filters.status ?? "all"}
            onChange={(v) => updateFilters({ status: v === "all" ? undefined : v })}
            options={toOptions(ORDER_STATUS_LABELS, "Tüm durumlar")}
            aria-label="Sipariş durumu"
          />
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Select
            style={{ width: "100%" }}
            value={filters.paymentStatus ?? "all"}
            onChange={(v) => updateFilters({ paymentStatus: v === "all" ? undefined : v })}
            options={toOptions(PAYMENT_STATUS_LABELS, "Tüm ödeme durumları")}
            aria-label="Ödeme durumu"
          />
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Select
            style={{ width: "100%" }}
            value={filters.paymentMethod ?? "all"}
            onChange={(v) => updateFilters({ paymentMethod: v === "all" ? undefined : v })}
            options={toOptions(PAYMENT_METHOD_LABELS, "Tüm ödeme yöntemleri")}
            aria-label="Ödeme yöntemi"
          />
        </Col>
        <Col xs={24} sm={12} lg={5}>
          <DatePicker.RangePicker
            style={{ width: "100%" }}
            format="DD MMM YYYY"
            allowEmpty={[true, true]}
            value={filters.dateRange}
            onChange={(v) => updateFilters({ dateRange: v ?? undefined })}
          />
        </Col>
      </FilterBar>

      <SectionCard>
        <ListError error={error} onRetry={refetch} />
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={1000}
          emptyDescription={error ? "Liste yüklenemedi." : "Filtrelerle eşleşen sipariş yok."}
          onRow={(record) => ({ onClick: () => setOpenId(record.id), style: { cursor: "pointer" } })}
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
      </SectionCard>

      <OrderDetailDrawer orderId={openId} onClose={() => setOpenId(null)} onChanged={refetch} />
    </>
  );
}
