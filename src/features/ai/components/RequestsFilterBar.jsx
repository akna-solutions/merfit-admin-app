import React from "react";
import { Col, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FilterBar, DateRangeFilter } from "../../../components/admin";

export default function RequestsFilterBar({ filters, onChange, onReset }) {
  return (
    <FilterBar onReset={onReset}>
      <Col xs={24} sm={12} lg={7}>
        <Input
          allowClear
          placeholder="Search by user"
          prefix={<SearchOutlined />}
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </Col>
      <Col xs={12} sm={6} lg={4}>
        <Select
          style={{ width: "100%" }}
          value={filters.type ?? "all"}
          onChange={(v) => onChange({ type: v === "all" ? undefined : v })}
          options={[
            { value: "all", label: "All types" },
            { value: "Workout", label: "Workout" },
            { value: "Nutrition", label: "Nutrition" },
            { value: "Insight", label: "Insight" },
          ]}
        />
      </Col>
      <Col xs={12} sm={6} lg={4}>
        <Select
          style={{ width: "100%" }}
          value={filters.status ?? "all"}
          onChange={(v) => onChange({ status: v === "all" ? undefined : v })}
          options={[
            { value: "all", label: "All statuses" },
            { value: "Pending", label: "Pending" },
            { value: "Processing", label: "Processing" },
            { value: "Completed", label: "Completed" },
            { value: "Failed", label: "Failed" },
          ]}
        />
      </Col>
      <Col xs={24} sm={12} lg={9}>
        <DateRangeFilter value={filters.dateRange} onChange={(dateRange) => onChange({ dateRange })} />
      </Col>
    </FilterBar>
  );
}
