import React, { useEffect, useState } from "react";
import { Button, App } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { PageHeader, PageContainer, SectionCard, DataTable } from "../../../components/admin";
import { useWorkouts } from "../hooks/useWorkouts";
import { workoutService } from "../services/workoutService";
import { buildWorkoutsColumns } from "../components/workoutsColumns";
import WorkoutsFilterBar from "../components/WorkoutsFilterBar";
import WorkoutFormDrawer from "../components/WorkoutFormDrawer";
import WorkoutDetailDrawer from "../components/WorkoutDetailDrawer";

export default function WorkoutsPage() {
  const { message } = App.useApp();
  const {
    rows, total, loading, filters, page, pageSize,
    setPage, setPageSize, updateFilters, resetFilters, refetch,
  } = useWorkouts();

  const [lookups, setLookups] = useState({ categories: [], muscleGroups: [], exercises: [] });
  const [formState, setFormState] = useState({ open: false, workout: null });
  const [submitting, setSubmitting] = useState(false);
  const [detailState, setDetailState] = useState({ open: false, workout: null, loading: false });

  useEffect(() => {
    Promise.all([
      workoutService.getCategoryOptions(),
      workoutService.getMuscleGroupOptions(),
      workoutService.getExerciseOptions(),
    ]).then(([categories, muscleGroups, exercises]) => {
      setLookups({
        categories: categories.data.items,
        muscleGroups: muscleGroups.data.items,
        exercises: exercises.data.items,
      });
    });
  }, []);

  const handleView = async (record) => {
    setDetailState({ open: true, workout: null, loading: true });
    const detail = await workoutService.getWorkoutById(record.id);
    setDetailState({ open: true, workout: detail.data, loading: false });
  };

  const handleEdit = (record) => setFormState({ open: true, workout: record });

  const handleToggleStatus = async (record) => {
    const nextActive = !record.isActive;
    await workoutService.updateStatus(record.id, { isActive: nextActive });
    message.success(`"${record.title}" is now ${nextActive ? "active" : "inactive"}.`);
    refetch();
  };

  const handleDelete = async (record) => {
    await workoutService.deleteWorkout(record.id);
    message.success(`"${record.title}" was deleted.`);
    refetch();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (formState.workout) {
        await workoutService.updateWorkout(formState.workout.id, values);
        message.success("Workout updated.");
        refetch();
      } else {
        const created = await workoutService.createWorkout(values);
        message.success("Workout created. You can now add exercises.");
        refetch();
        // Keep the drawer open, switched into edit mode, so the exercise
        // editor (which needs a real workout id) becomes available —
        // matches the real API's two-step create-then-attach-exercises flow.
        setFormState({ open: true, workout: created.data });
        return;
      }
      setFormState({ open: false, workout: null });
    } finally {
      setSubmitting(false);
    }
  };

  const columns = buildWorkoutsColumns({
    onView: handleView,
    onEdit: handleEdit,
    onToggleStatus: handleToggleStatus,
    onDelete: handleDelete,
  });

  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: "Dashboard", path: "/admin" }, { label: "Workouts" }]}
        title="Workouts"
        description="Manage the Merfit workout library."
        actions={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setFormState({ open: true, workout: null })}
          >
            Create Workout
          </Button>
        }
      />

      <WorkoutsFilterBar
        filters={filters}
        categories={lookups.categories}
        onChange={updateFilters}
        onReset={resetFilters}
      />

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={1300}
          emptyDescription="No workouts match these filters."
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

      <WorkoutFormDrawer
        open={formState.open}
        workout={formState.workout}
        categories={lookups.categories}
        muscleGroups={lookups.muscleGroups}
        exerciseOptions={lookups.exercises}
        submitting={submitting}
        onClose={() => setFormState({ open: false, workout: null })}
        onSubmit={handleSubmit}
      />

      <WorkoutDetailDrawer
        open={detailState.open}
        workout={detailState.workout}
        loading={detailState.loading}
        onClose={() => setDetailState({ open: false, workout: null, loading: false })}
      />
    </PageContainer>
  );
}
