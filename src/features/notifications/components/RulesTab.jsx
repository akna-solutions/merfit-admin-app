import React, { useState } from "react";
import { Button, Col, Input, Select, Typography } from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, PlayCircleOutlined, PauseCircleOutlined, StopOutlined, UnorderedListOutlined,
} from "@ant-design/icons";
import { SectionCard, DataTable, StatusTag, RowActions, EntityCell, FilterBar, DetailDrawer } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { notificationRuleService } from "../services/notificationService";
import { useApiAction } from "../hooks/useApiAction";
import { useNotificationMetadata } from "../hooks/useNotificationMetadata";
import { RULE_KIND_LABELS, RULE_STATUS_LABELS, MEAL_TYPE_LABELS, STATUS_COLORS, label, toOptions } from "../utils/notificationLabels";
import { describeMask } from "../utils/notificationForm";
import RuleFormDrawer from "./RuleFormDrawer";
import DispatchTable from "./DispatchTable";

const { Text } = Typography;

export default function RulesTab() {
  const run = useApiAction();
  const { metadata } = useNotificationMetadata();
  const { rows, total, loading, filters, page, pageSize, setPage, setPageSize, updateFilters, resetFilters, refetch } =
    useListQuery(notificationRuleService.getRules, { search: "", kind: undefined, status: undefined });
  const [formState, setFormState] = useState({ open: false, rule: null });
  const [submitting, setSubmitting] = useState(false);
  const [dispatchRule, setDispatchRule] = useState(null);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    const ok = formState.rule
      ? await run(() => notificationRuleService.updateRule(formState.rule.id, values), "Kural güncellendi.")
      : await run(() => notificationRuleService.createRule(values), "Kural duraklatılmış olarak oluşturuldu.");
    setSubmitting(false);
    if (ok) {
      setFormState({ open: false, rule: null });
      refetch();
    }
  };

  const changeStatus = async (record, status) => {
    if (await run(() => notificationRuleService.changeStatus(record.id, status), `"${record.name}": ${RULE_STATUS_LABELS[status]}.`)) refetch();
  };

  const handleDelete = async (record) => {
    if (await run(() => notificationRuleService.deleteRule(record.id), "Kural silindi.")) refetch();
  };

  const columns = [
    {
      title: "Kural",
      key: "name",
      width: 260,
      render: (_, r) => <EntityCell title={r.name} subtitle={label(RULE_KIND_LABELS, r.kind) + (r.mealType ? ` · ${label(MEAL_TYPE_LABELS, r.mealType)}` : "")} avatarColor="#16A34A" />,
    },
    { title: "Saat", dataIndex: "localTime", key: "localTime", width: 80 },
    { title: "Günler", dataIndex: "daysOfWeekMask", key: "daysOfWeekMask", width: 170, render: describeMask },
    {
      title: "Şablon",
      key: "templates",
      width: 110,
      render: (_, r) =>
        r.activeTemplateCount > 0 ? `${r.activeTemplateCount} aktif / ${r.templateIds.length}` : <Text type="danger">Aktif şablon yok</Text>,
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (v) => <StatusTag status={v} colorMap={STATUS_COLORS}>{label(RULE_STATUS_LABELS, v)}</StatusTag>,
    },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, r) => (
        <RowActions
          items={[
            { key: "edit", label: "Düzenle", icon: <EditOutlined />, onClick: () => setFormState({ open: true, rule: r }) },
            ...(r.status !== "Active" ? [{ key: "activate", label: "Aktifleştir", icon: <PlayCircleOutlined />, onClick: () => changeStatus(r, "Active") }] : []),
            ...(r.status === "Active" ? [{ key: "pause", label: "Duraklat", icon: <PauseCircleOutlined />, onClick: () => changeStatus(r, "Paused") }] : []),
            ...(r.status !== "Inactive" ? [{ key: "deactivate", label: "Pasifleştir", icon: <StopOutlined />, onClick: () => changeStatus(r, "Inactive") }] : []),
            { key: "dispatches", label: "Gönderimler", icon: <UnorderedListOutlined />, onClick: () => setDispatchRule(r) },
            ...(r.status !== "Active"
              ? [{ key: "delete", label: "Sil", icon: <DeleteOutlined />, danger: true, confirm: `"${r.name}" silinsin mi? Geçmiş gönderimler korunur.`, onClick: () => handleDelete(r) }]
              : []),
          ]}
        />
      ),
    },
  ];

  return (
    <div className="mbfit-page" style={{ gap: 16 }}>
      <FilterBar
        onReset={resetFilters}
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, rule: null })}>Yeni Kural</Button>}
      >
        <Col xs={24} sm={12} lg={8}>
          <Input allowClear prefix={<SearchOutlined />} placeholder="Kural adında ara" value={filters.search} onChange={(e) => updateFilters({ search: e.target.value })} />
        </Col>
        <Col xs={12} sm={6} lg={5}>
          <Select allowClear style={{ width: "100%" }} placeholder="Tür" value={filters.kind} onChange={(kind) => updateFilters({ kind })} options={toOptions(RULE_KIND_LABELS)} />
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Select allowClear style={{ width: "100%" }} placeholder="Durum" value={filters.status} onChange={(status) => updateFilters({ status })} options={toOptions(RULE_STATUS_LABELS)} />
        </Col>
      </FilterBar>
      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={900}
          emptyDescription="Henüz kural yok."
          pagination={{ current: page, pageSize, total, onChange: (p, s) => { setPage(p); setPageSize(s); } }}
        />
      </SectionCard>
      <RuleFormDrawer
        open={formState.open}
        rule={formState.rule}
        defaultTimeZone={metadata.defaultTimeZone}
        submitting={submitting}
        onClose={() => setFormState({ open: false, rule: null })}
        onSubmit={handleSubmit}
      />
      <DetailDrawer open={Boolean(dispatchRule)} width={1000} title={dispatchRule ? `"${dispatchRule.name}" gönderimleri` : ""} onClose={() => setDispatchRule(null)}>
        {dispatchRule && <DispatchTable fixedFilters={{ ruleId: dispatchRule.id, source: "Rule" }} />}
      </DetailDrawer>
    </div>
  );
}
