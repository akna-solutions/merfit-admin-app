import React from "react";
import { Col, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FilterBar, DateRangeFilter } from "../../../components/admin";
import { STATUS_LABELS, PRIORITY_LABELS } from "../data/supportMockData";

export default function TicketsFilterBar({ filters, onChange, onReset }) {
  return (
    <FilterBar onReset={onReset}>
      <Col xs={24} sm={12} lg={7}>
        <Input
          allowClear
          placeholder="Konu veya kullanıcıya göre ara"
          prefix={<SearchOutlined />}
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </Col>
      <Col xs={12} sm={6} lg={4}>
        <Select
          style={{ width: "100%" }}
          value={filters.status ?? "all"}
          onChange={(v) => onChange({ status: v === "all" ? undefined : v })}
          options={[
            { value: "all", label: "Tüm durumlar" },
            { value: "Open", label: STATUS_LABELS.Open },
            { value: "InProgress", label: STATUS_LABELS.InProgress },
            { value: "Resolved", label: STATUS_LABELS.Resolved },
            { value: "Closed", label: STATUS_LABELS.Closed },
          ]}
        />
      </Col>
      <Col xs={12} sm={6} lg={4}>
        <Select
          style={{ width: "100%" }}
          value={filters.priority ?? "all"}
          onChange={(v) => onChange({ priority: v === "all" ? undefined : v })}
          options={[
            { value: "all", label: "Tüm öncelikler" },
            { value: "Low", label: PRIORITY_LABELS.Low },
            { value: "Medium", label: PRIORITY_LABELS.Medium },
            { value: "High", label: PRIORITY_LABELS.High },
            { value: "Urgent", label: PRIORITY_LABELS.Urgent },
          ]}
        />
      </Col>
      <Col xs={24} sm={12} lg={9}>
        <DateRangeFilter value={filters.dateRange} onChange={(dateRange) => onChange({ dateRange })} />
      </Col>
    </FilterBar>
  );
}
