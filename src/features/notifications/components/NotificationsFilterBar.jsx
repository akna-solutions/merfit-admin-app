import React from "react";
import { Col, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FilterBar, DateRangeFilter } from "../../../components/admin";

export default function NotificationsFilterBar({ filters, onChange, onReset }) {
  return (
    <FilterBar onReset={onReset}>
      <Col xs={24} sm={12} lg={8}>
        <Input
          allowClear
          placeholder="Search by title, body or user"
          prefix={<SearchOutlined />}
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </Col>
      <Col xs={12} sm={6} lg={5}>
        <Select
          style={{ width: "100%" }}
          value={filters.isRead === undefined ? "all" : String(filters.isRead)}
          onChange={(v) => onChange({ isRead: v === "all" ? undefined : v === "true" })}
          options={[
            { value: "all", label: "All" },
            { value: "true", label: "Read" },
            { value: "false", label: "Unread" },
          ]}
        />
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <DateRangeFilter value={filters.dateRange} onChange={(dateRange) => onChange({ dateRange })} />
      </Col>
    </FilterBar>
  );
}
