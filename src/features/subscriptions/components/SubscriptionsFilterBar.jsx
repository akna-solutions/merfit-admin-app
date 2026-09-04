import React from "react";
import { Col, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FilterBar, DateRangeFilter } from "../../../components/admin";

const STATUSES = ["Active", "Expired", "Cancelled", "Refunded", "Paused", "GracePeriod"];
const STATUS_LABELS = {
  Active: "Aktif",
  Expired: "Süresi Doldu",
  Cancelled: "İptal Edildi",
  Refunded: "İade Edildi",
  Paused: "Duraklatıldı",
  GracePeriod: "Ek Süre",
};

export default function SubscriptionsFilterBar({ filters, onChange, onReset }) {
  return (
    <FilterBar onReset={onReset}>
      <Col xs={24} sm={12} lg={8}>
        <Input
          allowClear
          placeholder="Kullanıcıya veya ürüne göre ara"
          prefix={<SearchOutlined />}
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </Col>
      <Col xs={12} sm={6} lg={5}>
        <Select
          style={{ width: "100%" }}
          value={filters.status ?? "all"}
          onChange={(v) => onChange({ status: v === "all" ? undefined : v })}
          options={[{ value: "all", label: "Tüm durumlar" }, ...STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] ?? s }))]}
        />
      </Col>
      <Col xs={12} sm={6} lg={5}>
        <Select
          style={{ width: "100%" }}
          value={filters.provider ?? "all"}
          onChange={(v) => onChange({ provider: v === "all" ? undefined : v })}
          options={[
            { value: "all", label: "Tüm sağlayıcılar" },
            { value: "Apple", label: "Apple" },
            { value: "Google", label: "Google" },
          ]}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <DateRangeFilter value={filters.dateRange} onChange={(dateRange) => onChange({ dateRange })} />
      </Col>
    </FilterBar>
  );
}
