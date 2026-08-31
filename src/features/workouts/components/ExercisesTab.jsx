import React, { useEffect, useState } from "react";
import { Button, Col, Input, Select, Tag, Typography, App } from "antd";
import {
  PlusOutlined, EditOutlined, StopOutlined, CheckCircleOutlined, DeleteOutlined, SearchOutlined,
} from "@ant-design/icons";
import { SectionCard, DataTable, EntityCell, StatusTag, RowActions, FilterBar } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { exerciseService, muscleGroupService } from "../services/workoutService";
import { DIFFICULTY_LEVEL } from "../../../constants/apiEnums";
import ExerciseFormDrawer from "./ExerciseFormDrawer";

const { Text } = Typography;

// MerfitApi.Api/Controllers/Admin/AdminExerciseController.cs — exerciseService
// already covered every endpoint (list/create/update/delete/status), but it
// was only ever called for the Workout form's exercise picker. This tab is
// the actual exercise library manager.
export default function ExercisesTab() {
  const { message } = App.useApp();
  const {
    rows, total, loading, filters, page, pageSize,
    setPage, setPageSize, updateFilters, resetFilters, refetch,
  } = useListQuery(
    exerciseService.getExercises,
    { search: "", difficulty: undefined, muscleGroupId: undefined, isActive: undefined },
  );

  const [muscleGroups, setMuscleGroups] = useState([]);
  const [formState, setFormState] = useState({ open: false, exercise: null });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    muscleGroupService.getMuscleGroups({ pageSize: 200 }).then((res) => setMuscleGroups(res.data.items));
  }, []);

  const handleToggleStatus = async (record) => {
    await exerciseService.updateStatus(record.id, { isActive: !record.isActive });
    message.success(`"${record.name}" is now ${!record.isActive ? "active" : "inactive"}.`);
    refetch();
  };

  const handleDelete = async (record) => {
    await exerciseService.deleteExercise(record.id);
    message.success(`"${record.name}" was deleted.`);
    refetch();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (formState.exercise) {
        await exerciseService.updateExercise(formState.exercise.id, values);
        message.success("Exercise updated.");
      } else {
        await exerciseService.createExercise(values);
        message.success("Exercise created.");
      }
      setFormState({ open: false, exercise: null });
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Exercise",
      key: "name",
      fixed: "left",
      width: 240,
      render: (_, r) => <EntityCell title={r.name} subtitle={r.slug} avatarColor="#722ED1" />,
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      key: "difficulty",
      width: 120,
      render: (v) => (
        <Tag color={v === "Beginner" ? "green" : v === "Intermediate" ? "blue" : "purple"}>{v}</Tag>
      ),
    },
    {
      title: "Primary Muscle Group",
      dataIndex: "primaryMuscleGroupName",
      key: "primaryMuscleGroupName",
      width: 170,
      render: (v) => v ?? <Text type="secondary">—</Text>,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 110,
      render: (v) => <StatusTag status={v ? "Active" : "Inactive"} />,
    },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, record) => (
        <RowActions
          items={[
            { key: "edit", label: "Edit", icon: <EditOutlined />, onClick: () => setFormState({ open: true, exercise: record }) },
            {
              key: "toggle",
              label: record.isActive ? "Deactivate" : "Activate",
              icon: record.isActive ? <StopOutlined /> : <CheckCircleOutlined />,
              onClick: () => handleToggleStatus(record),
            },
            {
              key: "delete",
              label: "Delete",
              icon: <DeleteOutlined />,
              danger: true,
              confirm: `Delete "${record.name}"? This cannot be undone.`,
              onClick: () => handleDelete(record),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="merfit-page" style={{ gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, exercise: null })}>
          Create Exercise
        </Button>
      </div>

      <FilterBar onReset={resetFilters}>
        <Col xs={24} sm={12} lg={7}>
          <Input
            allowClear
            placeholder="Search by exercise name"
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </Col>
        <Col xs={12} sm={6} lg={5}>
          <Select
            style={{ width: "100%" }}
            placeholder="Difficulty"
            allowClear
            value={filters.difficulty}
            onChange={(v) => updateFilters({ difficulty: v })}
            options={DIFFICULTY_LEVEL.map((d) => ({ value: d, label: d }))}
          />
        </Col>
        <Col xs={12} sm={6} lg={6}>
          <Select
            style={{ width: "100%" }}
            placeholder="Muscle group"
            allowClear
            showSearch
            optionFilterProp="label"
            value={filters.muscleGroupId}
            onChange={(v) => updateFilters({ muscleGroupId: v })}
            options={muscleGroups.map((m) => ({ value: m.id, label: m.name }))}
          />
        </Col>
      </FilterBar>

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={900}
          emptyDescription="No exercises match these filters."
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

      <ExerciseFormDrawer
        open={formState.open}
        exercise={formState.exercise}
        muscleGroups={muscleGroups}
        submitting={submitting}
        onClose={() => setFormState({ open: false, exercise: null })}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
