import React, { useEffect, useState } from "react";
import { Descriptions, Tag, Table, Skeleton, Tabs, Typography } from "antd";
import dayjs from "dayjs";
import { DetailDrawer, StatusTag } from "../../../components/admin";
import { workoutService } from "../services/workoutService";

const { Paragraph } = Typography;

function OverviewTab({ workout }) {
  return (
    <>
      {workout.tagline && <Paragraph type="secondary">{workout.tagline}</Paragraph>}
      {workout.description && <Paragraph>{workout.description}</Paragraph>}
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Category">{workout.categoryName}</Descriptions.Item>
        <Descriptions.Item label="Muscle Group">{workout.muscleGroupName ?? "—"}</Descriptions.Item>
        <Descriptions.Item label="Difficulty">{workout.difficulty}</Descriptions.Item>
        <Descriptions.Item label="Duration">{workout.durationMin} min</Descriptions.Item>
        <Descriptions.Item label="Status"><StatusTag status={workout.isActive ? "Active" : "Inactive"} /></Descriptions.Item>
        <Descriptions.Item label="Featured">{workout.isFeatured ? <Tag color="blue">Yes</Tag> : "No"}</Descriptions.Item>
        <Descriptions.Item label="Premium">{workout.isPremium ? <Tag color="gold">Yes</Tag> : "No"}</Descriptions.Item>
        <Descriptions.Item label="AI Generated">{workout.isAiGenerated ? <Tag color="purple">Yes</Tag> : "No"}</Descriptions.Item>
        <Descriptions.Item label="Created At">{dayjs(workout.createdAt).format("DD MMM YYYY")}</Descriptions.Item>
        <Descriptions.Item label="Updated At">
          {workout.updatedAt ? dayjs(workout.updatedAt).format("DD MMM YYYY") : "—"}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
}

function ExercisesTab({ exercises, loading }) {
  const columns = [
    { title: "#", dataIndex: "order", key: "order", width: 44 },
    { title: "Exercise", dataIndex: "exerciseName", key: "exerciseName" },
    { title: "Sets", dataIndex: "sets", key: "sets", width: 70 },
    { title: "Reps", dataIndex: "reps", key: "reps", width: 70, render: (v) => v ?? "—" },
    { title: "Rest", dataIndex: "restSeconds", key: "restSeconds", width: 90, render: (v) => (v ? `${v}s` : "—") },
  ];
  return (
    <Table
      columns={columns}
      dataSource={exercises}
      rowKey="exerciseId"
      size="small"
      loading={loading}
      pagination={false}
    />
  );
}

function EquipmentTab({ equipment, loading }) {
  const columns = [{ title: "Equipment", dataIndex: "equipmentName", key: "equipmentName" }];
  return (
    <Table
      columns={columns}
      dataSource={equipment}
      rowKey="equipmentId"
      size="small"
      loading={loading}
      pagination={false}
    />
  );
}

export default function WorkoutDetailDrawer({ open, workout, loading, onClose }) {
  const [exercises, setExercises] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [subLoading, setSubLoading] = useState(false);

  useEffect(() => {
    if (open && workout?.id) {
      setSubLoading(true);
      Promise.all([
        workoutService.getExercises(workout.id),
        workoutService.getEquipment(workout.id),
      ]).then(([ex, eq]) => {
        setExercises(ex.data);
        setEquipment(eq.data);
        setSubLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, workout?.id]);

  return (
    <DetailDrawer open={open} title="Workout Detail" width={560} onClose={onClose}>
      {loading || !workout ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <Tabs
          defaultActiveKey="overview"
          items={[
            { key: "overview", label: "Overview", children: <OverviewTab workout={workout} /> },
            { key: "exercises", label: "Exercises", children: <ExercisesTab exercises={exercises} loading={subLoading} /> },
            { key: "equipment", label: "Equipment", children: <EquipmentTab equipment={equipment} loading={subLoading} /> },
          ]}
        />
      )}
    </DetailDrawer>
  );
}
