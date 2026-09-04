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
          placeholder="Kullanıcıya göre ara"
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
            { value: "all", label: "Tüm türler" },
            { value: "Workout", label: "Antrenman" },
            { value: "Nutrition", label: "Beslenme" },
            { value: "Insight", label: "İçgörü" },
          ]}
        />
      </Col>
      <Col xs={12} sm={6} lg={4}>
        <Select
          style={{ width: "100%" }}
          value={filters.status ?? "all"}
          onChange={(v) => onChange({ status: v === "all" ? undefined : v })}
          options={[
            { value: "all", label: "Tüm durumlar" },
            { value: "Pending", label: "Beklemede" },
            { value: "Processing", label: "İşleniyor" },
            { value: "Completed", label: "Tamamlandı" },
            { value: "Failed", label: "Başarısız" },
          ]}
        />
      </Col>
      <Col xs={24} sm={12} lg={9}>
        <DateRangeFilter value={filters.dateRange} onChange={(dateRange) => onChange({ dateRange })} />
      </Col>
    </FilterBar>
  );
}
