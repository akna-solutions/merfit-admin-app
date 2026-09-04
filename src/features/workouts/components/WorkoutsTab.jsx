import React, { useEffect, useState } from "react";
import { Button, App } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { SectionCard, DataTable } from "../../../components/admin";
import { useWorkouts } from "../hooks/useWorkouts";
import { workoutService } from "../services/workoutService";
import { buildWorkoutsColumns } from "./workoutsColumns";
import WorkoutsFilterBar from "./WorkoutsFilterBar";
import WorkoutFormDrawer from "./WorkoutFormDrawer";
import WorkoutDetailDrawer from "./WorkoutDetailDrawer";

// The original Workouts screen (workout library CRUD). Now hosted as a tab
// inside WorkoutsPage, alongside the lookup-table tabs (categories, muscle
// groups, equipment, exercises, plans) that used to have no UI at all even
// though their services already existed.
export default function WorkoutsTab() {
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
    message.success(`"${record.title}" artık ${nextActive ? "aktif" : "pasif"}.`);
    refetch();
  };

  const handleDelete = async (record) => {
    await workoutService.deleteWorkout(record.id);
    message.success(`"${record.title}" silindi.`);
    refetch();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (formState.workout) {
        await workoutService.updateWorkout(formState.workout.id, values);
        message.success("Antrenman güncellendi.");
        refetch();
      } else {
        const created = await workoutService.createWorkout(values);
        message.success("Antrenman oluşturuldu. Artık egzersiz ekleyebilirsiniz.");
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
    <div className="merfit-page" style={{ gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setFormState({ open: true, workout: null })}
        >
          Antrenman Oluştur
        </Button>
      </div>

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
          emptyDescription="Bu filtrelerle eşleşen antrenman yok."
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
    </div>
  );
}
