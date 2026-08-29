import React from "react";
import { Col, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FilterBar } from "../../../components/admin";
import { CONTENT_TYPES } from "../data/contentMockData";

export default function ContentFilterBar({ filters, onChange, onReset }) {
  return (
    <FilterBar onReset={onReset}>
      <Col xs={24} sm={12} lg={8}>
        <Input
          allowClear
          placeholder="Search by title or key"
          prefix={<SearchOutlined />}
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </Col>
      <Col xs={12} sm={6} lg={5}>
        <Select
          style={{ width: "100%" }}
          value={filters.type ?? "all"}
          onChange={(v) => onChange({ type: v === "all" ? undefined : v })}
          options={[{ value: "all", label: "All types" }, ...CONTENT_TYPES.map((t) => ({ value: t, label: t }))]}
        />
      </Col>
      <Col xs={12} sm={6} lg={5}>
        <Select
          style={{ width: "100%" }}
          value={filters.isActive === undefined ? "all" : String(filters.isActive)}
          onChange={(v) => onChange({ isActive: v === "all" ? undefined : v === "true" })}
          options={[
            { value: "all", label: "All statuses" },
            { value: "true", label: "Active" },
            { value: "false", label: "Inactive" },
          ]}
        />
      </Col>
    </FilterBar>
  );
}
