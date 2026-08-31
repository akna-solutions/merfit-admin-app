import React, { useState } from "react";
import { Button, App } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { SectionCard, DataTable, EntityCell, RowActions } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { equipmentService } from "../services/workoutService";
import EquipmentFormDrawer from "./EquipmentFormDrawer";

// MerfitApi.Api/Controllers/Admin/AdminEquipmentController.cs — full CRUD
// existed in equipmentService but was only ever used as a read-only lookup
// (e.g. attaching equipment to a workout). This tab is the actual manager.
export default function EquipmentTab() {
  const { message } = App.useApp();
  const {
    rows, total, loading, page, pageSize, setPage, setPageSize, refetch,
  } = useListQuery(equipmentService.getEquipmentList, { search: "" }, 20);

  const [formState, setFormState] = useState({ open: false, equipment: null });
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async (record) => {
    await equipmentService.deleteEquipment(record.id);
    message.success(`"${record.name}" was deleted.`);
    refetch();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (formState.equipment) {
        await equipmentService.updateEquipment(formState.equipment.id, values);
        message.success("Equipment updated.");
      } else {
        await equipmentService.createEquipment(values);
        message.success("Equipment created.");
      }
      setFormState({ open: false, equipment: null });
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Equipment",
      key: "name",
      width: 260,
      render: (_, r) => <EntityCell title={r.name} subtitle={r.slug} avatarColor="#13A8A8" />,
    },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, record) => (
        <RowActions
          items={[
            { key: "edit", label: "Edit", icon: <EditOutlined />, onClick: () => setFormState({ open: true, equipment: record }) },
            {
              key: "delete",
              label: "Delete",
              icon: <DeleteOutlined />,
              danger: true,
              confirm: `Delete "${record.name}"? Workouts using it may be affected.`,
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
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, equipment: null })}>
          Create Equipment
        </Button>
      </div>

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={500}
          emptyDescription="No equipment yet."
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

      <EquipmentFormDrawer
        open={formState.open}
        equipment={formState.equipment}
        submitting={submitting}
        onClose={() => setFormState({ open: false, equipment: null })}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
