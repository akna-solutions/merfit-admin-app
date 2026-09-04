import React from "react";
import { Col, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FilterBar, DateRangeFilter } from "../../../components/admin";

// Options mirror AdminUserListRequest.IsActive (bool?) and
// AdminUserListRequest.SubscriptionStatus ("active"|"expired"|"cancelled"|
// "none" for users with no subscription at all).
export default function UsersFilterBar({ filters, onChange, onReset }) {
  return (
    <FilterBar onReset={onReset}>
      <Col xs={24} sm={12} lg={8}>
        <Input
          allowClear
          placeholder="İsim, kullanıcı adı veya e-posta ile ara"
          prefix={<SearchOutlined />}
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </Col>
      <Col xs={12} sm={6} lg={4}>
        <Select
          style={{ width: "100%" }}
          value={filters.isActive === undefined ? "all" : String(filters.isActive)}
          onChange={(value) =>
            onChange({ isActive: value === "all" ? undefined : value === "true" })
          }
          options={[
            { value: "all", label: "Tüm durumlar" },
            { value: "true", label: "Aktif" },
            { value: "false", label: "Pasif" },
          ]}
        />
      </Col>
      <Col xs={12} sm={6} lg={4}>
        <Select
          style={{ width: "100%" }}
          value={filters.subscriptionStatus ?? "all"}
          onChange={(value) =>
            onChange({ subscriptionStatus: value === "all" ? undefined : value })
          }
          options={[
            { value: "all", label: "Tüm planlar" },
            { value: "active", label: "Aktif" },
            { value: "expired", label: "Süresi Doldu" },
            { value: "cancelled", label: "İptal Edildi" },
            { value: "none", label: "Aboneliği Yok" },
          ]}
        />
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <DateRangeFilter
          value={filters.dateRange}
          onChange={(dateRange) => onChange({ dateRange })}
        />
      </Col>
    </FilterBar>
  );
}
