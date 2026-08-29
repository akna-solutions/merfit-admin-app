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
          placeholder="Search by name, username or email"
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
            { value: "all", label: "All statuses" },
            { value: "true", label: "Active" },
            { value: "false", label: "Inactive" },
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
            { value: "all", label: "All plans" },
            { value: "active", label: "Active" },
            { value: "expired", label: "Expired" },
            { value: "cancelled", label: "Cancelled" },
            { value: "none", label: "No subscription" },
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
