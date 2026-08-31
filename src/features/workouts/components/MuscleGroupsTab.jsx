import React, { useState } from "react";
import { Button, App } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { SectionCard, DataTable, EntityCell, RowActions } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { muscleGroupService } from "../services/workoutService";
import MuscleGroupFormDrawer from "./MuscleGroupFormDrawer";

// MerfitApi.Api/Controllers/Admin/AdminMuscleGroupController.cs — the
// screen the user specifically flagged as missing. muscleGroupService's
// full CRUD already existed (used only as a read-only lookup elsewhere);
// this tab is the first place it's actually managed.
export default function MuscleGroupsTab() {
  const { message } = App.useApp();
  const {
    rows, total, loading, page, pageSize, setPage, setPageSize, refetch,
  } = useListQuery(muscleGroupService.getMuscleGroups, { search: "" }, 20);

  const [formState, setFormState] = useState({ open: false, muscleGroup: null });
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async (record) => {
    await muscleGroupService.deleteMuscleGroup(record.id);
    message.success(`"${record.name}" was deleted.`);
    refetch();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (formState.muscleGroup) {
        await muscleGroupService.updateMuscleGroup(formState.muscleGroup.id, values);
        message.success("Muscle group updated.");
      } else {
        await muscleGroupService.createMuscleGroup(values);
        message.success("Muscle group created.");
      }
      setFormState({ open: false, muscleGroup: null });
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Muscle Group",
      key: "name",
      width: 260,
      render: (_, r) => <EntityCell title={r.name} subtitle={r.slug} avatarColor="#F5222D" />,
    },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, record) => (
        <RowActions
          items={[
            { key: "edit", label: "Edit", icon: <EditOutlined />, onClick: () => setFormState({ open: true, muscleGroup: record }) },
            {
              key: "delete",
              label: "Delete",
              icon: <DeleteOutlined />,
              danger: true,
              confirm: `Delete "${record.name}"? Exercises using it may be affected.`,
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
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, muscleGroup: null })}>
          Create Muscle Group
        </Button>
      </div>

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={500}
          emptyDescription="No muscle groups yet."
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

      <MuscleGroupFormDrawer
        open={formState.open}
        muscleGroup={formState.muscleGroup}
        submitting={submitting}
        onClose={() => setFormState({ open: false, muscleGroup: null })}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
