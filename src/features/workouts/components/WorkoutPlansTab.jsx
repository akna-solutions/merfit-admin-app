import React, { useState } from "react";
import { Col, Input, Select, Tag, Typography, App } from "antd";
import { EyeOutlined, StopOutlined, CheckCircleOutlined, RobotOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { SectionCard, DataTable, EntityCell, StatusTag, RowActions, FilterBar } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { workoutPlanService } from "../services/workoutService";
import { FITNESS_GOAL } from "../../../constants/apiEnums";
import { fitnessGoalLabel } from "../data/enumLabels";
import WorkoutPlanDetailDrawer from "./WorkoutPlanDetailDrawer";

const { Text } = Typography;

// MerfitApi.Api/Controllers/Admin/AdminWorkoutPlanController.cs — read-only
// list + status + days management already existed in workoutPlanService but
// had no screen at all (user-generated / AI-generated plans were invisible
// to admins).
export default function WorkoutPlansTab() {
  const { message } = App.useApp();
  const {
    rows, total, loading, filters, page, pageSize,
    setPage, setPageSize, updateFilters, resetFilters, refetch,
  } = useListQuery(
    workoutPlanService.getPlans,
    { userId: undefined, isActive: undefined, isAiGenerated: undefined, goal: undefined },
  );

  const [detailState, setDetailState] = useState({ open: false, plan: null, loading: false });

  const handleView = async (record) => {
    setDetailState({ open: true, plan: null, loading: true });
    const detail = await workoutPlanService.getPlanById(record.id);
    setDetailState({ open: true, plan: detail.data, loading: false });
  };

  const handleToggleStatus = async (record) => {
    await workoutPlanService.updateStatus(record.id, { isActive: !record.isActive });
    message.success(`"${record.name}" artık ${!record.isActive ? "aktif" : "pasif"}.`);
    refetch();
  };

  const columns = [
    {
      title: "Plan",
      key: "name",
      fixed: "left",
      width: 220,
      render: (_, r) => <EntityCell title={r.name} subtitle={r.userEmail} avatarColor="#FA8C16" />,
    },
    {
      title: "Hedef",
      dataIndex: "goal",
      key: "goal",
      width: 150,
      render: (v) => (v ? fitnessGoalLabel(v) : <Text type="secondary">—</Text>),
    },
    {
      title: "Başlangıç Tarihi",
      dataIndex: "startDate",
      key: "startDate",
      width: 130,
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : "—"),
    },
    {
      title: "Bitiş Tarihi",
      dataIndex: "endDate",
      key: "endDate",
      width: 130,
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : <Text type="secondary">—</Text>),
    },
    {
      title: "Yapay Zeka ile Oluşturuldu",
      dataIndex: "isAiGenerated",
      key: "isAiGenerated",
      width: 120,
      render: (v) => (v ? <Tag icon={<RobotOutlined />} color="purple">YZ</Tag> : <Text type="secondary">—</Text>),
    },
    {
      title: "Durum",
      dataIndex: "isActive",
      key: "isActive",
      width: 110,
      render: (v) => <StatusTag status={v ? "Active" : "Inactive"}>{v ? "Aktif" : "Pasif"}</StatusTag>,
    },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, record) => (
        <RowActions
          items={[
            { key: "view", label: "Günleri Görüntüle", icon: <EyeOutlined />, onClick: () => handleView(record) },
            {
              key: "toggle",
              label: record.isActive ? "Pasifleştir" : "Aktifleştir",
              icon: record.isActive ? <StopOutlined /> : <CheckCircleOutlined />,
              onClick: () => handleToggleStatus(record),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="merfit-page" style={{ gap: 20 }}>
      <FilterBar onReset={resetFilters}>
        <Col xs={12} sm={8} lg={5}>
          <Input
            allowClear
            placeholder="Kullanıcı ID"
            value={filters.userId}
            onChange={(e) => updateFilters({ userId: e.target.value ? Number(e.target.value) : undefined })}
          />
        </Col>
        <Col xs={12} sm={8} lg={6}>
          <Select
            style={{ width: "100%" }}
            placeholder="Hedef"
            allowClear
            value={filters.goal}
            onChange={(v) => updateFilters({ goal: v })}
            options={FITNESS_GOAL.map((g) => ({ value: g, label: fitnessGoalLabel(g) }))}
          />
        </Col>
        <Col xs={12} sm={8} lg={5}>
          <Select
            style={{ width: "100%" }}
            placeholder="Durum"
            allowClear
            value={filters.isActive}
            onChange={(v) => updateFilters({ isActive: v })}
            options={[{ value: true, label: "Aktif" }, { value: false, label: "Pasif" }]}
          />
        </Col>
        <Col xs={12} sm={8} lg={5}>
          <Select
            style={{ width: "100%" }}
            placeholder="Kaynak"
            allowClear
            value={filters.isAiGenerated}
            onChange={(v) => updateFilters({ isAiGenerated: v })}
            options={[{ value: true, label: "Yapay Zeka ile Oluşturuldu" }, { value: false, label: "Manuel" }]}
          />
        </Col>
      </FilterBar>

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={1000}
          emptyDescription="Bu filtrelerle eşleşen antrenman planı yok."
          onRow={(record) => ({ className: "merfit-row-clickable", onClick: () => handleView(record) })}
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: (nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            },
          }}
        />
      </SectionCard>

      <WorkoutPlanDetailDrawer
        open={detailState.open}
        plan={detailState.plan}
        loading={detailState.loading}
        onClose={() => setDetailState({ open: false, plan: null, loading: false })}
      />
    </div>
  );
}
