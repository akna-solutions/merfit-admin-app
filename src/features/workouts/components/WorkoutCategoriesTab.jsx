import React, { useState } from "react";
import { Button, Col, Select, Typography, App } from "antd";
import { PlusOutlined, EditOutlined, StopOutlined, CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { SectionCard, DataTable, EntityCell, StatusTag, RowActions, FilterBar } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { workoutCategoryService } from "../services/workoutService";
import WorkoutCategoryFormDrawer from "./WorkoutCategoryFormDrawer";

const { Text } = Typography;

// MerfitApi.Api/Controllers/Admin/AdminWorkoutCategoryController.cs — full
// CRUD was already implemented in workoutCategoryService but had no screen.
export default function WorkoutCategoriesTab() {
  const { message } = App.useApp();
  const {
    rows, total, loading, filters, page, pageSize,
    setPage, setPageSize, updateFilters, resetFilters, refetch,
  } = useListQuery(workoutCategoryService.getCategories, { search: "", isActive: undefined }, 20);

  const [formState, setFormState] = useState({ open: false, category: null });
  const [submitting, setSubmitting] = useState(false);

  const handleToggleStatus = async (record) => {
    await workoutCategoryService.updateCategory(record.id, { ...record, isActive: !record.isActive });
    message.success(`"${record.name}" is now ${!record.isActive ? "active" : "inactive"}.`);
    refetch();
  };

  const handleDelete = async (record) => {
    await workoutCategoryService.deleteCategory(record.id);
    message.success(`"${record.name}" was deleted.`);
    refetch();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (formState.category) {
        await workoutCategoryService.updateCategory(formState.category.id, values);
        message.success("Category updated.");
      } else {
        await workoutCategoryService.createCategory(values);
        message.success("Category created.");
      }
      setFormState({ open: false, category: null });
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Category",
      key: "name",
      width: 240,
      render: (_, r) => <EntityCell title={r.name} subtitle={r.slug} avatarColor="#2F6FED" />,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 260,
      render: (v) => v || <Text type="secondary">—</Text>,
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
            { key: "edit", label: "Edit", icon: <EditOutlined />, onClick: () => setFormState({ open: true, category: record }) },
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
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, category: null })}>
          Create Category
        </Button>
      </div>

      <FilterBar onReset={resetFilters}>
        <Col xs={12} sm={8} lg={6}>
          <Select
            style={{ width: "100%" }}
            value={filters.isActive === undefined ? "all" : filters.isActive}
            onChange={(v) => updateFilters({ isActive: v === "all" ? undefined : v })}
            options={[
              { value: "all", label: "All statuses" },
              { value: true, label: "Active" },
              { value: false, label: "Inactive" },
            ]}
          />
        </Col>
      </FilterBar>

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={800}
          emptyDescription="No workout categories yet."
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

      <WorkoutCategoryFormDrawer
        open={formState.open}
        category={formState.category}
        submitting={submitting}
        onClose={() => setFormState({ open: false, category: null })}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
