import React from "react";
import { Col, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FilterBar, DateRangeFilter } from "../../../components/admin";

export default function TicketsFilterBar({ filters, onChange, onReset }) {
  return (
    <FilterBar onReset={onReset}>
      <Col xs={24} sm={12} lg={7}>
        <Input
          allowClear
          placeholder="Search by subject or user"
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
            { value: "all", label: "All statuses" },
            { value: "Open", label: "Open" },
            { value: "InProgress", label: "In Progress" },
            { value: "Resolved", label: "Resolved" },
            { value: "Closed", label: "Closed" },
          ]}
        />
      </Col>
      <Col xs={12} sm={6} lg={4}>
        <Select
          style={{ width: "100%" }}
          value={filters.priority ?? "all"}
          onChange={(v) => onChange({ priority: v === "all" ? undefined : v })}
          options={[
            { value: "all", label: "All priorities" },
            { value: "Low", label: "Low" },
            { value: "Medium", label: "Medium" },
            { value: "High", label: "High" },
            { value: "Urgent", label: "Urgent" },
          ]}
        />
      </Col>
      <Col xs={24} sm={12} lg={9}>
        <DateRangeFilter value={filters.dateRange} onChange={(dateRange) => onChange({ dateRange })} />
      </Col>
    </FilterBar>
  );
}
