import React from "react";
import { Col, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FilterBar, DateRangeFilter } from "../../../components/admin";
import { NOTIFICATION_TYPE_LABELS, toOptions, typesForApp } from "../utils/notificationLabels";

export default function NotificationsFilterBar({ app, filters, onChange, onReset }) {
  const types = app ? typesForApp(Object.keys(NOTIFICATION_TYPE_LABELS), app) : undefined;
  return (
    <FilterBar onReset={onReset}>
      <Col xs={24} sm={12} lg={8}>
        <Input
          allowClear
          placeholder="Ara"
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
            { value: "all", label: "Tümü" },
            { value: "true", label: "Okundu" },
            { value: "false", label: "Okunmadı" },
          ]}
        />
      </Col>
      <Col xs={12} sm={6} lg={5}>
        <Select
          allowClear
          style={{ width: "100%" }}
          placeholder="Tür"
          value={filters.type}
          onChange={(type) => onChange({ type })}
          options={toOptions(NOTIFICATION_TYPE_LABELS, types)}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <DateRangeFilter value={filters.dateRange} onChange={(dateRange) => onChange({ dateRange })} />
      </Col>
    </FilterBar>
  );
}
