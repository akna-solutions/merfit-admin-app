import React from "react";
import { Col, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FilterBar } from "../../../components/admin";
import { DIFFICULTY_LEVEL } from "../../../constants/apiEnums";

const TRI_STATE = (label) => [
  { value: "all", label },
  { value: "true", label: "Yes" },
  { value: "false", label: "No" },
];

export default function WorkoutsFilterBar({ filters, categories, onChange, onReset }) {
  return (
    <FilterBar onReset={onReset}>
      <Col xs={24} sm={12} lg={6}>
        <Input
          allowClear
          placeholder="Search workouts"
          prefix={<SearchOutlined />}
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </Col>
      <Col xs={12} sm={6} lg={5}>
        <Select
          style={{ width: "100%" }}
          value={filters.categoryId ?? "all"}
          onChange={(value) => onChange({ categoryId: value === "all" ? undefined : value })}
          options={[
            { value: "all", label: "All categories" },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />
      </Col>
      <Col xs={12} sm={6} lg={4}>
        <Select
          style={{ width: "100%" }}
          value={filters.difficulty ?? "all"}
          onChange={(value) => onChange({ difficulty: value === "all" ? undefined : value })}
          options={[
            { value: "all", label: "All levels" },
            ...DIFFICULTY_LEVEL.map((d) => ({ value: d, label: d })),
          ]}
        />
      </Col>
      <Col xs={8} sm={4} lg={3}>
        <Select
          style={{ width: "100%" }}
          value={filters.isPremium === undefined ? "all" : String(filters.isPremium)}
          onChange={(value) => onChange({ isPremium: value === "all" ? undefined : value === "true" })}
          options={TRI_STATE("Premium")}
        />
      </Col>
      <Col xs={8} sm={4} lg={3}>
        <Select
          style={{ width: "100%" }}
          value={filters.isFeatured === undefined ? "all" : String(filters.isFeatured)}
          onChange={(value) => onChange({ isFeatured: value === "all" ? undefined : value === "true" })}
          options={TRI_STATE("Featured")}
        />
      </Col>
      <Col xs={8} sm={4} lg={3}>
        <Select
          style={{ width: "100%" }}
          value={filters.isActive === undefined ? "all" : String(filters.isActive)}
          onChange={(value) => onChange({ isActive: value === "all" ? undefined : value === "true" })}
          options={TRI_STATE("Active")}
        />
      </Col>
    </FilterBar>
  );
}
