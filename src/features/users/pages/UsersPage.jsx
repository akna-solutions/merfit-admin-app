import React, { useState } from "react";
import { App } from "antd";
import { PageHeader, PageContainer, SectionCard, DataTable } from "../../../components/admin";
import { useUsers } from "../hooks/useUsers";
import { userService } from "../services/userService";
import { buildUsersColumns } from "../components/usersColumns";
import UsersFilterBar from "../components/UsersFilterBar";
import UserDetailDrawer from "../components/UserDetailDrawer";

const EMPTY_RELATED = {
  subscriptions: [],
  workoutSessions: [],
  meals: [],
  nutritionGoal: null,
  measurements: [],
  scoreBreakdown: [],
  achievements: [],
  devices: [],
  supportTickets: [],
};

export default function UsersPage() {
  const { message } = App.useApp();
  const {
    rows,
    total,
    loading,
    filters,
    page,
    pageSize,
    setPage,
    setPageSize,
    updateFilters,
    resetFilters,
    refetch,
  } = useUsers();

  const [detailState, setDetailState] = useState({
    open: false,
    user: null,
    related: EMPTY_RELATED,
    loading: false,
  });

  // Assembles the User Detail drawer from every AdminUserController
  // sub-resource endpoint in parallel, mirroring how a real detail screen
  // would fan out its requests once each is a genuine HTTP call.
  const handleView = async (record) => {
    setDetailState({ open: true, user: null, related: EMPTY_RELATED, loading: true });
    const [
      detail,
      subscriptions,
      workoutSessions,
      meals,
      nutritionGoal,
      measurements,
      scoreBreakdown,
      achievements,
      devices,
      supportTickets,
    ] = await Promise.all([
      userService.getUserById(record.id),
      userService.getSubscriptions(record.id),
      userService.getWorkoutSessions(record.id),
      userService.getMeals(record.id),
      userService.getNutritionGoal(record.id),
      userService.getMeasurements(record.id),
      userService.getScoreBreakdown(record.id),
      userService.getAchievements(record.id),
      userService.getDevices(record.id),
      userService.getSupportTickets(record.id),
    ]);

    setDetailState({
      open: true,
      user: detail.data,
      loading: false,
      related: {
        subscriptions: subscriptions.data.items,
        workoutSessions: workoutSessions.data.items,
        meals: meals.data.items,
        nutritionGoal: nutritionGoal.data,
        measurements: measurements.data.items,
        scoreBreakdown: scoreBreakdown.data,
        achievements: achievements.data.items,
        devices: devices.data.items,
        supportTickets: supportTickets.data,
      },
    });
  };

  const handleToggleStatus = async (record) => {
    const nextActive = !record.isActive;
    await userService.updateStatus(record.id, { isActive: nextActive });
    message.success(`${record.firstName} ${record.lastName} is now ${nextActive ? "active" : "inactive"}.`);
    refetch();
  };

  const handleDelete = async (record) => {
    await userService.deleteUser(record.id);
    message.success(`${record.firstName} ${record.lastName} was deleted.`);
    refetch();
  };

  const handleRestore = async (record) => {
    await userService.restoreUser(record.id);
    message.success(`${record.firstName} ${record.lastName} was restored.`);
    refetch();
  };

  const columns = buildUsersColumns({
    onView: handleView,
    onToggleStatus: handleToggleStatus,
    onDelete: handleDelete,
    onRestore: handleRestore,
  });

  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: "Dashboard", path: "/admin" }, { label: "Users" }]}
        title="Users"
        description="Manage all Merfit users."
      />

      <UsersFilterBar filters={filters} onChange={updateFilters} onReset={resetFilters} />

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={1100}
          emptyDescription="No users match these filters."
          onRow={(record) => ({
            className: "merfit-row-clickable",
            onClick: () => handleView(record),
          })}
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

      <UserDetailDrawer
        open={detailState.open}
        user={detailState.user}
        related={detailState.related}
        loading={detailState.loading}
        onClose={() => setDetailState({ open: false, user: null, related: EMPTY_RELATED, loading: false })}
      />
    </PageContainer>
  );
}
