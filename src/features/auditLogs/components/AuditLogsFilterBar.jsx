import React from "react";
import { Col, Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FilterBar, DateRangeFilter } from "../../../components/admin";

// Kod değerleri API ile birebir eşleşir (bkz. MBFitApi DTO'ları) — değiştirilmez;
// yalnızca kullanıcıya gösterilen etiketler Türkçeleştirilir.
const ACTIONS = ["Create", "Update", "Delete", "StatusChange", "Login", "Publish"];
const ENTITIES = ["User", "Workout", "Food", "SubscriptionProduct", "Content", "Faq", "Achievement", "SupportTicket"];

const ACTION_LABELS = {
  Create: "Oluşturma",
  Update: "Güncelleme",
  Delete: "Silme",
  StatusChange: "Durum Değişikliği",
  Login: "Giriş",
  Publish: "Yayınlama",
};

const ENTITY_LABELS = {
  User: "Kullanıcı",
  Workout: "Antrenman",
  Food: "Besin",
  SubscriptionProduct: "Abonelik Ürünü",
  Content: "İçerik",
  Faq: "SSS",
  Achievement: "Başarı",
  SupportTicket: "Destek Talebi",
};

export default function AuditLogsFilterBar({ filters, onChange, onReset }) {
  return (
    <FilterBar onReset={onReset}>
      <Col xs={24} sm={12} lg={7}>
        <Input
          allowClear
          placeholder="Yönetici, varlık veya işleme göre ara"
          prefix={<SearchOutlined />}
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
      </Col>
      <Col xs={12} sm={6} lg={4}>
        <Select
          style={{ width: "100%" }}
          value={filters.action ?? "all"}
          onChange={(v) => onChange({ action: v === "all" ? undefined : v })}
          options={[{ value: "all", label: "Tüm işlemler" }, ...ACTIONS.map((a) => ({ value: a, label: ACTION_LABELS[a] }))]}
        />
      </Col>
      <Col xs={12} sm={6} lg={4}>
        <Select
          style={{ width: "100%" }}
          value={filters.entity ?? "all"}
          onChange={(v) => onChange({ entity: v === "all" ? undefined : v })}
          options={[{ value: "all", label: "Tüm varlıklar" }, ...ENTITIES.map((e) => ({ value: e, label: ENTITY_LABELS[e] }))]}
        />
      </Col>
      <Col xs={24} sm={12} lg={9}>
        <DateRangeFilter value={filters.dateRange} onChange={(dateRange) => onChange({ dateRange })} />
      </Col>
    </FilterBar>
  );
}
