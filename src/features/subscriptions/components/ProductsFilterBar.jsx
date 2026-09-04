import React from "react";
import { Col, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FilterBar } from "../../../components/admin";

export default function ProductsFilterBar({ filters, onChange, onReset }) {
  return (
    <FilterBar onReset={onReset}>
      <Col xs={24} sm={12} lg={8}>
        <Input
          allowClear
          placeholder="İsme veya koda göre ara"
          prefix={<SearchOutlined />}
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </Col>
      <Col xs={12} sm={6} lg={5}>
        <Select
          style={{ width: "100%" }}
          value={filters.billingPeriod ?? "all"}
          onChange={(v) => onChange({ billingPeriod: v === "all" ? undefined : v })}
          options={[
            { value: "all", label: "Tüm dönemler" },
            { value: "Monthly", label: "Aylık" },
            { value: "Yearly", label: "Yıllık" },
          ]}
        />
      </Col>
      <Col xs={12} sm={6} lg={5}>
        <Select
          style={{ width: "100%" }}
          value={filters.isActive === undefined ? "all" : String(filters.isActive)}
          onChange={(v) => onChange({ isActive: v === "all" ? undefined : v === "true" })}
          options={[
            { value: "all", label: "Tüm durumlar" },
            { value: "true", label: "Aktif" },
            { value: "false", label: "Pasif" },
          ]}
        />
      </Col>
    </FilterBar>
  );
}
