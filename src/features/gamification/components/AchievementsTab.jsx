import React, { useState } from "react";
import { Button, Tag, Typography, App } from "antd";
import { PlusOutlined, EditOutlined, StopOutlined, CheckCircleOutlined, DeleteOutlined, TeamOutlined } from "@ant-design/icons";
import { SectionCard, DataTable, StatusTag, RowActions } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { achievementService } from "../services/gamificationService";
import AchievementFormDrawer from "./AchievementFormDrawer";
import AchievementUsersDrawer from "./AchievementUsersDrawer";

const { Text } = Typography;

export default function AchievementsTab() {
  const { message } = App.useApp();
  const {
    rows, total, loading, page, pageSize, setPage, setPageSize, refetch,
  } = useListQuery(achievementService.getAchievements, { search: "", isActive: undefined });

  const [formState, setFormState] = useState({ open: false, achievement: null });
  const [submitting, setSubmitting] = useState(false);
  const [usersState, setUsersState] = useState({ open: false, achievement: null, users: [], loading: false });

  const handleToggleStatus = async (record) => {
    await achievementService.updateStatus(record.id, { isActive: !record.isActive });
    message.success(`"${record.title}" artık ${!record.isActive ? "aktif" : "pasif"}.`);
    refetch();
  };

  const handleDelete = async (record) => {
    await achievementService.deleteAchievement(record.id);
    message.success(`"${record.title}" silindi.`);
    refetch();
  };

  const handleViewUsers = async (record) => {
    setUsersState({ open: true, achievement: record, users: [], loading: true });
    const res = await achievementService.getUsers(record.id);
    setUsersState({ open: true, achievement: record, users: res.data.items, loading: false });
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (formState.achievement) {
        await achievementService.updateAchievement(formState.achievement.id, values);
        message.success("Başarı güncellendi.");
      } else {
        await achievementService.createAchievement(values);
        message.success("Başarı oluşturuldu.");
      }
      setFormState({ open: false, achievement: null });
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { title: "Simge", dataIndex: "icon", key: "icon", width: 60, render: (v) => <span style={{ fontSize: 20 }}>{v}</span> },
    { title: "Başlık", dataIndex: "title", key: "title", width: 200 },
    { title: "Kod", dataIndex: "code", key: "code", width: 160, render: (v) => <Text code>{v}</Text> },
    { title: "Puan", dataIndex: "points", key: "points", width: 90 },
    {
      title: "Koşul",
      key: "condition",
      width: 180,
      render: (_, r) => <Tag>{r.conditionType} ≥ {r.conditionValue}</Tag>,
    },
    { title: "Durum", dataIndex: "isActive", key: "isActive", width: 100, render: (v) => <StatusTag status={v ? "Active" : "Inactive"}>{v ? "Aktif" : "Pasif"}</StatusTag> },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, record) => (
        <RowActions
          items={[
            { key: "users", label: "Kullanıcıları Görüntüle", icon: <TeamOutlined />, onClick: () => handleViewUsers(record) },
            { key: "edit", label: "Düzenle", icon: <EditOutlined />, onClick: () => setFormState({ open: true, achievement: record }) },
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
    <div className="merfit-page" style={{ gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, achievement: null })}>
          Başarı Oluştur
        </Button>
      </div>

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={1050}
          emptyDescription="Henüz başarı yok."
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

      <AchievementFormDrawer
        open={formState.open}
        achievement={formState.achievement}
        submitting={submitting}
        onClose={() => setFormState({ open: false, achievement: null })}
        onSubmit={handleSubmit}
      />

      <AchievementUsersDrawer
        open={usersState.open}
        achievement={usersState.achievement}
        users={usersState.users}
        loading={usersState.loading}
        onClose={() => setUsersState({ open: false, achievement: null, users: [], loading: false })}
      />
    </div>
  );
}
