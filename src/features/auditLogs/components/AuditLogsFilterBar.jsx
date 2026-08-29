import React from "react";
import { Col, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FilterBar, DateRangeFilter } from "../../../components/admin";

const ACTIONS = ["Create", "Update", "Delete", "StatusChange", "Login", "Publish"];
const ENTITIES = ["User", "Workout", "Food", "SubscriptionProduct", "Content", "Faq", "Achievement", "SupportTicket"];

export default function AuditLogsFilterBar({ filters, onChange, onReset }) {
  return (
    <FilterBar onReset={onReset}>
      <Col xs={24} sm={12} lg={7}>
        <Input
          allowClear
          placeholder="Search by admin, entity or action"
          prefix={<SearchOutlined />}
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </Col>
      <Col xs={12} sm={6} lg={4}>
        <Select
          style={{ width: "100%" }}
          value={filters.action ?? "all"}
          onChange={(v) => onChange({ action: v === "all" ? undefined : v })}
          options={[{ value: "all", label: "All actions" }, ...ACTIONS.map((a) => ({ value: a, label: a }))]}
        />
      </Col>
      <Col xs={12} sm={6} lg={4}>
        <Select
          style={{ width: "100%" }}
          value={filters.entity ?? "all"}
          onChange={(v) => onChange({ entity: v === "all" ? undefined : v })}
          options={[{ value: "all", label: "All entities" }, ...ENTITIES.map((e) => ({ value: e, label: e }))]}
        />
      </Col>
      <Col xs={24} sm={12} lg={9}>
        <DateRangeFilter value={filters.dateRange} onChange={(dateRange) => onChange({ dateRange })} />
      </Col>
    </FilterBar>
  );
}
