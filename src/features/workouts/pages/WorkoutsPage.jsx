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
        crumbs={[{ label: "Panel", path: "/admin" }, { label: "Antrenmanlar" }]}
        title="Antrenmanlar"
        description="Merfit antrenman kütüphanesini, kategorileri, kas gruplarını, ekipmanları, egzersizleri ve kullanıcı planlarını yönetin."
      />
      <Tabs
        defaultActiveKey="workouts"
        items={[
          { key: "workouts", label: "Antrenmanlar", children: <WorkoutsTab /> },
          { key: "categories", label: "Kategoriler", children: <WorkoutCategoriesTab /> },
          { key: "muscle-groups", label: "Kas Grupları", children: <MuscleGroupsTab /> },
          { key: "equipment", label: "Ekipman", children: <EquipmentTab /> },
          { key: "exercises", label: "Egzersizler", children: <ExercisesTab /> },
          { key: "plans", label: "Antrenman Planları", children: <WorkoutPlansTab /> },
        ]}
      />
    </PageContainer>
  );
}
