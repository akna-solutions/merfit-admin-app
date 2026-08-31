import React, { useState } from "react";
import { Button, Typography, App } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { SectionCard, DataTable, EntityCell, RowActions } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { featureService } from "../services/subscriptionsService";
import FeatureFormDrawer from "./FeatureFormDrawer";

const { Text } = Typography;

// MerfitApi.Api/Controllers/Admin/AdminFeatureController.cs had no service
// or screen at all before — this is the master list of Features that can be
// attached to a subscription product (see the "Features" section of the
// Products tab's edit form).
export default function FeaturesTab() {
  const { message } = App.useApp();
  const {
    rows, total, loading, page, pageSize, setPage, setPageSize, refetch,
  } = useListQuery(featureService.getFeatures, { search: "" }, 20);

  const [formState, setFormState] = useState({ open: false, feature: null });
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async (record) => {
    await featureService.deleteFeature(record.id);
    message.success(`"${record.name}" was deleted.`);
    refetch();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (formState.feature) {
        await featureService.updateFeature(formState.feature.id, values);
        message.success("Feature updated.");
      } else {
        await featureService.createFeature(values);
        message.success("Feature created.");
      }
      setFormState({ open: false, feature: null });
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Feature",
      key: "name",
      width: 260,
      render: (_, r) => <EntityCell title={r.name} subtitle={r.code} avatarColor="#52C41A" />,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 320,
      render: (v) => v || <Text type="secondary">—</Text>,
    },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, record) => (
        <RowActions
          items={[
            { key: "edit", label: "Edit", icon: <EditOutlined />, onClick: () => setFormState({ open: true, feature: record }) },
            {
              key: "delete",
              label: "Delete",
              icon: <DeleteOutlined />,
              danger: true,
              confirm: `Delete "${record.name}"? Products using it will lose this feature.`,
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
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, feature: null })}>
          Create Feature
        </Button>
      </div>

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={700}
          emptyDescription="No features yet."
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

      <FeatureFormDrawer
        open={formState.open}
        feature={formState.feature}
        submitting={submitting}
        onClose={() => setFormState({ open: false, feature: null })}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
