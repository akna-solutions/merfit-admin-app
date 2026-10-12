import React from "react";
import { Col, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FilterBar } from "../../../components/admin";

export default function FoodsFilterBar({ filters, onChange, onReset }) {
  return (
    <FilterBar onReset={onReset}>
      <Col xs={24} sm={12} lg={8}>
        <Input
          allowClear
          placeholder="Besin adına göre ara"
          prefix={<SearchOutlined />}
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </Col>
      <Col xs={12} sm={6} lg={5}>
        <Input
          allowClear
          placeholder="Marka"
          value={filters.brand}
          onChange={(e) => onChange({ brand: e.target.value || undefined })}
        />
      </Col>
      <Col xs={12} sm={6} lg={5}>
        <Input
          allowClear
          placeholder="Barkod"
          value={filters.barcode}
          onChange={(e) => onChange({ barcode: e.target.value || undefined })}
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Select
          allowClear
          style={{ width: "100%" }}
          placeholder="Program sınıflandırması"
          value={filters.isClassified}
          onChange={(value) => onChange({ isClassified: value })}
          options={[
            { value: false, label: "Sınıflandırılmamış" },
            { value: true, label: "Sınıflandırılmış" },
          ]}
        />
      </Col>
    </FilterBar>
  );
}
