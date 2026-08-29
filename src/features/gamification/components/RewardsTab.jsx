import React, { useState } from "react";
import { Button, Tag, Typography, App } from "antd";
import { PlusOutlined, EditOutlined, StopOutlined, CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { SectionCard, DataTable, StatusTag, RowActions, EntityCell } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { rewardService } from "../services/gamificationService";
import RewardFormDrawer from "./RewardFormDrawer";

const { Text } = Typography;

export default function RewardsTab() {
  const { message } = App.useApp();
  const {
    rows, total, loading, page, pageSize, setPage, setPageSize, refetch,
  } = useListQuery(rewardService.getRewards, { search: "", isActive: undefined, rewardType: undefined });

  const [formState, setFormState] = useState({ open: false, reward: null });
  const [submitting, setSubmitting] = useState(false);

  const handleToggleStatus = async (record) => {
    await rewardService.updateStatus(record.id, { isActive: !record.isActive });
    message.success(`"${record.title}" is now ${!record.isActive ? "active" : "inactive"}.`);
    refetch();
  };

  const handleDelete = async (record) => {
    await rewardService.deleteReward(record.id);
    message.success(`"${record.title}" was deleted.`);
    refetch();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (formState.reward) {
        await rewardService.updateReward(formState.reward.id, values);
        message.success("Reward updated.");
      } else {
        await rewardService.createReward(values);
        message.success("Reward created.");
      }
      setFormState({ open: false, reward: null });
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Reward",
      key: "title",
      width: 260,
      render: (_, r) => <EntityCell title={r.title} subtitle={r.description} avatarColor="#7C3AED" />,
    },
    { title: "Type", dataIndex: "rewardType", key: "rewardType", width: 130, render: (v) => <Tag>{v}</Tag> },
    { title: "Value", dataIndex: "value", key: "value", width: 150, render: (v) => v ?? <Text type="secondary">—</Text> },
    { title: "Status", dataIndex: "isActive", key: "isActive", width: 100, render: (v) => <StatusTag status={v ? "Active" : "Inactive"} /> },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, record) => (
        <RowActions
          items={[
            { key: "edit", label: "Edit", icon: <EditOutlined />, onClick: () => setFormState({ open: true, reward: record }) },
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
              confirm: `Delete "${record.title}"?`,
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
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, reward: null })}>
          Create Reward
        </Button>
      </div>

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={800}
          emptyDescription="No rewards yet."
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

      <RewardFormDrawer
        open={formState.open}
        reward={formState.reward}
        submitting={submitting}
        onClose={() => setFormState({ open: false, reward: null })}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
