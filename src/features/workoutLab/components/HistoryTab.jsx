import React, { useState } from "react";
import { App, Button, Col, Input, Select, Space, Table, Tag, Typography } from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, RedoOutlined, SwapOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { EmptyState, FilterBar, RowActions, SectionCard, StatusTag } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { workoutLabService } from "../services/workoutLabService";
import {
  CHECK_STATUS_LABELS, EXPERIENCE_LABELS, LOCATION_LABELS, RATING_COLORS, RATING_LABELS, RATING_ORDER,
  SIMULATION_STATUS_COLORS, SIMULATION_STATUS_LABELS, experienceLabel, fitnessGoalLabel, locationLabel,
  ratingLabel, statusLabel,
} from "../utils/labLabels";
import { PRIMARY_FITNESS_GOALS } from "../../workouts/data/enumLabels";
import SimulationDetailDrawer from "./SimulationDetailDrawer";

const { Text } = Typography;

const DEFAULT_FILTERS = {
  search: undefined,
  status: undefined,
  goal: undefined,
  experienceLevel: undefined,
  trainingLocation: undefined,
  isPlus: undefined,
  rating: undefined,
  isEvaluated: undefined,
  hasFailedChecks: undefined,
  algorithmVersion: undefined,
};

const toOptions = (labels) => Object.entries(labels).map(([value, label]) => ({ value, label }));
const boolOptions = (yes, no) => [{ value: true, label: yes }, { value: false, label: no }];

function CheckCounts({ record }) {
  if (record.status !== "Completed") return <Text type="secondary">—</Text>;
  return (
    <Space size={2}>
      <Tag color="green" title={CHECK_STATUS_LABELS.Passed}>{record.passedCheckCount}</Tag>
      <Tag color="gold" title={CHECK_STATUS_LABELS.Warning}>{record.warningCheckCount}</Tag>
      <Tag color="red" title={CHECK_STATUS_LABELS.Failed}>{record.failedCheckCount}</Tag>
    </Space>
  );
}

// Geçmiş testler: filtreleme, detay, yeniden çalıştırma, profili düzenleme, silme ve iki testi karşılaştırma.
export default function HistoryTab({ refreshKey, onEditProfile, onCompare, onRerun, rerunning }) {
  const { message } = App.useApp();
  const list = useListQuery(workoutLabService.getSimulations, DEFAULT_FILTERS);
  const { rows, total, loading, filters, page, pageSize, setPage, setPageSize, updateFilters, resetFilters, refetch } = list;
  const [selectedIds, setSelectedIds] = useState([]);
  const [detailId, setDetailId] = useState(null);

  React.useEffect(() => {
    if (refreshKey) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const handleRerun = async (record) => {
    const created = await onRerun?.(record);
    if (created?.id) {
      refetch();
      setDetailId(created.id);
    }
    return created;
  };

  const handleDelete = async (record) => {
    try {
      await workoutLabService.deleteSimulation(record.id);
      message.success("Test silindi.");
      setSelectedIds((ids) => ids.filter((id) => id !== record.id));
      refetch();
    } catch (e) {
      message.error(e?.message || "Test silinemedi.");
    }
  };

  const handleEdit = async (record) => {
    try {
      const response = await workoutLabService.getSimulation(record.id);
      onEditProfile?.(response.data);
    } catch (e) {
      message.error(e?.message || "Profil yüklenemedi.");
    }
  };

  const columns = [
    {
      title: "Test",
      key: "name",
      fixed: "left",
      width: 220,
      render: (_, r) => (
        <Space orientation="vertical" size={0}>
          <Button type="link" style={{ padding: 0, height: "auto" }} onClick={() => setDetailId(r.id)}>
            {r.name || `Test #${r.id}`}
          </Button>
          <Text type="secondary" style={{ fontSize: 12 }}>
            #{r.id}{r.sourceSimulationId ? ` · #${r.sourceSimulationId} tekrarı` : ""}
          </Text>
        </Space>
      ),
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (v) => <StatusTag status={v} colorMap={SIMULATION_STATUS_COLORS}>{statusLabel(v)}</StatusTag>,
    },
    {
      title: "Profil",
      key: "profile",
      width: 260,
      render: (_, r) => (
        <Text style={{ fontSize: 13 }}>
          {fitnessGoalLabel(r.goal)} · {experienceLabel(r.experienceLevel)} · {locationLabel(r.trainingLocation)} ·{" "}
          {r.trainingDaysPerWeek} gün · {r.workoutDurationMin ? `${r.workoutDurationMin} dk` : "vars. süre"} · {r.isPlus ? "Plus" : "Free"}
        </Text>
      ),
    },
    { title: "Kontroller", key: "checks", width: 140, render: (_, r) => <CheckCounts record={r} /> },
    {
      title: "Değerlendirme",
      dataIndex: "rating",
      key: "rating",
      width: 130,
      render: (v) => (v ? <StatusTag status={v} colorMap={RATING_COLORS}>{ratingLabel(v)}</StatusTag> : <Text type="secondary">—</Text>),
    },
    { title: "Algoritma", dataIndex: "algorithmVersion", key: "algorithmVersion", width: 120, render: (v) => v ?? "—" },
    {
      title: "Oluşturma",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (v, r) => (
        <Space orientation="vertical" size={0}>
          <span>{dayjs(v).format("DD MMM YYYY HH:mm")}</span>
          {r.createdByEmail && <Text type="secondary" style={{ fontSize: 12 }}>{r.createdByEmail}</Text>}
        </Space>
      ),
    },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, r) => (
        <RowActions
          items={[
            { key: "view", label: "Görüntüle", icon: <EyeOutlined />, onClick: () => setDetailId(r.id) },
            { key: "rerun", label: "Yeniden çalıştır", icon: <RedoOutlined />, onClick: () => handleRerun(r) },
            { key: "edit", label: "Profili düzenleyip yeni test", icon: <EditOutlined />, onClick: () => handleEdit(r) },
            { key: "delete", label: "Sil", icon: <DeleteOutlined />, danger: true, confirm: "Bu test kaydı silinsin mi?", onClick: () => handleDelete(r) },
          ]}
        />
      ),
    },
  ];

  const canCompare = selectedIds.length === 2;

  return (
    <div className="mbfit-page" style={{ gap: 16 }}>
      <FilterBar onReset={resetFilters}>
        <Col xs={24} sm={12} lg={6}>
          <Input.Search
            allowClear
            placeholder="Test adı"
            defaultValue={filters.search}
            onSearch={(v) => updateFilters({ search: v || undefined })}
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Select allowClear style={{ width: "100%" }} placeholder="Durum" value={filters.status}
            options={toOptions(SIMULATION_STATUS_LABELS)} onChange={(v) => updateFilters({ status: v })} />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Select allowClear style={{ width: "100%" }} placeholder="Hedef" value={filters.goal}
            options={PRIMARY_FITNESS_GOALS.map((g) => ({ value: g, label: fitnessGoalLabel(g) }))}
            onChange={(v) => updateFilters({ goal: v })} />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Select allowClear style={{ width: "100%" }} placeholder="Deneyim" value={filters.experienceLevel}
            options={toOptions(EXPERIENCE_LABELS)} onChange={(v) => updateFilters({ experienceLevel: v })} />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Select allowClear style={{ width: "100%" }} placeholder="Yer" value={filters.trainingLocation}
            options={toOptions(LOCATION_LABELS).filter((o) => o.value !== "Outdoor")}
            onChange={(v) => updateFilters({ trainingLocation: v })} />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Select allowClear style={{ width: "100%" }} placeholder="Abonelik" value={filters.isPlus}
            options={boolOptions("Plus", "Free")} onChange={(v) => updateFilters({ isPlus: v })} />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Select allowClear style={{ width: "100%" }} placeholder="Değerlendirme" value={filters.rating}
            options={RATING_ORDER.map((r) => ({ value: r, label: RATING_LABELS[r] }))}
            onChange={(v) => updateFilters({ rating: v })} />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Select allowClear style={{ width: "100%" }} placeholder="Değerlendirildi mi" value={filters.isEvaluated}
            options={boolOptions("Değerlendirildi", "Değerlendirilmedi")} onChange={(v) => updateFilters({ isEvaluated: v })} />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Select allowClear style={{ width: "100%" }} placeholder="Başarısız kontrol" value={filters.hasFailedChecks}
            options={boolOptions("Var", "Yok")} onChange={(v) => updateFilters({ hasFailedChecks: v })} />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Input allowClear placeholder="Algoritma sürümü" value={filters.algorithmVersion}
            onChange={(e) => updateFilters({ algorithmVersion: e.target.value || undefined })} />
        </Col>
      </FilterBar>

      <SectionCard
        title="Geçmiş testler"
        extra={
          <Space wrap>
            <Text type="secondary">{selectedIds.length}/2 seçili</Text>
            <Button type="primary" icon={<SwapOutlined />} disabled={!canCompare} onClick={() => onCompare?.(selectedIds[0], selectedIds[1])}>
              Karşılaştır
            </Button>
          </Space>
        }
        bodyPadding={0}
      >
        <DataTableWithSelection
          columns={columns}
          rows={rows}
          loading={loading}
          total={total}
          page={page}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
        />
      </SectionCard>

      <SimulationDetailDrawer
        simulationId={detailId}
        onClose={() => {
          setDetailId(null);
          refetch();
        }}
        onRerun={handleRerun}
        rerunning={rerunning}
        onChanged={refetch}
      />
    </div>
  );
}

// DataTable seçim desteklemediği için yalnızca bu tabloda Table'ın rowSelection'ı kullanılır; görünüm DataTable ile aynıdır.
function DataTableWithSelection({ columns, rows, loading, total, page, pageSize, setPage, setPageSize, selectedIds, setSelectedIds }) {
  return (
    <Table
      className="mbfit-data-table"
      rowKey="id"
      size="middle"
      sticky
      columns={columns}
      dataSource={rows}
      loading={loading}
      scroll={{ x: 1260 }}
      locale={{ emptyText: <EmptyState description="Henüz test yok. Yeni Test sekmesinden bir profil çalıştırın." /> }}
      rowSelection={{
        selectedRowKeys: selectedIds,
        hideSelectAll: true,
        onChange: (keys) => setSelectedIds(keys.slice(-2)),
        getCheckboxProps: (r) => ({ disabled: r.status !== "Completed" && !selectedIds.includes(r.id) }),
      }}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        showTotal: (t) => `Toplam ${t} test`,
        onChange: (p, ps) => {
          if (ps !== pageSize) {
            setPageSize(ps);
            setPage(1);
          } else {
            setPage(p);
          }
        },
      }}
    />
  );
}
