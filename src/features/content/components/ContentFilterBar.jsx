import React from "react";
import { Col, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FilterBar } from "../../../components/admin";
import { CONTENT_TYPES } from "../data/contentMockData";

// Kod değerleri API ile birebir eşleşir — yalnızca gösterilen etiketler Türkçeleştirilir.
const CONTENT_TYPE_LABELS = {
  Banner: "Banner",
  Announcement: "Duyuru",
  Campaign: "Kampanya",
  FeatureCard: "Özellik Kartı",
  Promotional: "Promosyon",
};

export default function ContentFilterBar({ filters, onChange, onReset }) {
  return (
    <FilterBar onReset={onReset}>
      <Col xs={24} sm={12} lg={8}>
        <Input
          allowClear
          placeholder="Başlık veya anahtara göre ara"
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
          options={[{ value: "all", label: "Tüm türler" }, ...CONTENT_TYPES.map((t) => ({ value: t, label: CONTENT_TYPE_LABELS[t] ?? t }))]}
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
