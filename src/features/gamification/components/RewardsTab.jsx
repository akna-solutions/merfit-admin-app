import React, { useState } from "react";
import { Button, Tag, Typography, App } from "antd";
import { PlusOutlined, EditOutlined, StopOutlined, CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { SectionCard, DataTable, StatusTag, RowActions, EntityCell } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { rewardService, REWARD_TYPE_LABELS } from "../services/gamificationService";
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
    message.success(`"${record.title}" artık ${!record.isActive ? "aktif" : "pasif"}.`);
    refetch();
  };

  const handleDelete = async (record) => {
    await rewardService.deleteReward(record.id);
    message.success(`"${record.title}" silindi.`);
    refetch();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (formState.reward) {
        await rewardService.updateReward(formState.reward.id, values);
        message.success("Ödül güncellendi.");
      } else {
        await rewardService.createReward(values);
        message.success("Ödül oluşturuldu.");
      }
      setFormState({ open: false, reward: null });
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Ödül",
      key: "title",
      width: 260,
      render: (_, r) => <EntityCell title={r.title} subtitle={r.description} avatarColor="#7C3AED" />,
    },
    { title: "Tür", dataIndex: "rewardType", key: "rewardType", width: 130, render: (v) => <Tag>{REWARD_TYPE_LABELS[v] ?? v}</Tag> },
    { title: "Değer", dataIndex: "value", key: "value", width: 150, render: (v) => v ?? <Text type="secondary">—</Text> },
    { title: "Durum", dataIndex: "isActive", key: "isActive", width: 100, render: (v) => <StatusTag status={v ? "Active" : "Inactive"}>{v ? "Aktif" : "Pasif"}</StatusTag> },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, record) => (
        <RowActions
          items={[
            { key: "edit", label: "Düzenle", icon: <EditOutlined />, onClick: () => setFormState({ open: true, reward: record }) },
            {
              key: "toggle",
              label: record.isActive ? "Pasifleştir" : "Aktifleştir",
              icon: record.isActive ? <StopOutlined /> : <CheckCircleOutlined />,
              onClick: () => handleToggleStatus(record),
            },
            {
              key: "delete",
              label: "Sil",
              icon: <DeleteOutlined />,
              danger: true,
              confirm: `"${record.title}" silinsin mi?`,
              onClick: () => handleDelete(record),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="mbfit-page" style={{ gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, reward: null })}>
          Ödül Oluştur
        </Button>
      </div>

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={800}
          emptyDescription="Henüz ödül yok."
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
