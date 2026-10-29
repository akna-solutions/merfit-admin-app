import React from "react";
import { Col, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FilterBar } from "../../../components/admin";
import { CAMPAIGN_STATUS_LABELS } from "../utils/campaignForm";

export default function CampaignFilterBar({ filters, onChange, onReset }) {
  return (
    <FilterBar onReset={onReset}>
      <Col xs={24} sm={12} lg={8}>
        <Input
          allowClear
          placeholder="Başlık veya kategoriye göre ara"
          prefix={<SearchOutlined />}
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Select
          style={{ width: "100%" }}
          value={filters.status ?? "all"}
          onChange={(v) => onChange({ status: v === "all" ? undefined : v })}
          options={[
            { value: "all", label: "Tüm durumlar" },
            ...Object.entries(CAMPAIGN_STATUS_LABELS).map(([value, label]) => ({ value, label })),
          ]}
        />
      </Col>
    </FilterBar>
  );
}
