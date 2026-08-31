import React from "react";
import { Tabs } from "antd";
import { PageHeader, PageContainer } from "../../../components/admin";
import WorkoutsTab from "../components/WorkoutsTab";
import WorkoutCategoriesTab from "../components/WorkoutCategoriesTab";
import MuscleGroupsTab from "../components/MuscleGroupsTab";
import EquipmentTab from "../components/EquipmentTab";
import ExercisesTab from "../components/ExercisesTab";
import WorkoutPlansTab from "../components/WorkoutPlansTab";

// Previously this page rendered only the Workout library CRUD, even though
// AdminWorkoutCategoryController, AdminMuscleGroupController,
// AdminEquipmentController, AdminExerciseController and
// AdminWorkoutPlanController already had fully working services with no
// screen anywhere in the app. Restructured as tabs, same pattern as
// FAQ / Nutrition / Gamification / Subscriptions.
export default function WorkoutsPage() {
  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: "Dashboard", path: "/admin" }, { label: "Workouts" }]}
        title="Workouts"
        description="Manage the Merfit workout library, categories, muscle groups, equipment, exercises and user plans."
      />
      <Tabs
        defaultActiveKey="workouts"
        items={[
          { key: "workouts", label: "Workouts", children: <WorkoutsTab /> },
          { key: "categories", label: "Categories", children: <WorkoutCategoriesTab /> },
          { key: "muscle-groups", label: "Muscle Groups", children: <MuscleGroupsTab /> },
          { key: "equipment", label: "Equipment", children: <EquipmentTab /> },
          { key: "exercises", label: "Exercises", children: <ExercisesTab /> },
          { key: "plans", label: "Workout Plans", children: <WorkoutPlansTab /> },
        ]}
      />
    </PageContainer>
  );
}
