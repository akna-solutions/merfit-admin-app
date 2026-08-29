import React from "react";
import { Col, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FilterBar, DateRangeFilter } from "../../../components/admin";

const STATUSES = ["Active", "Expired", "Cancelled", "Refunded", "Paused", "GracePeriod"];

export default function SubscriptionsFilterBar({ filters, onChange, onReset }) {
  return (
    <FilterBar onReset={onReset}>
      <Col xs={24} sm={12} lg={8}>
        <Input
          allowClear
          placeholder="Search by user or product"
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
          options={[{ value: "all", label: "All statuses" }, ...STATUSES.map((s) => ({ value: s, label: s }))]}
        />
      </Col>
      <Col xs={12} sm={6} lg={5}>
        <Select
          style={{ width: "100%" }}
          value={filters.provider ?? "all"}
          onChange={(v) => onChange({ provider: v === "all" ? undefined : v })}
          options={[
            { value: "all", label: "All providers" },
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
