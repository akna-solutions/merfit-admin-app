import React, { useEffect, useState } from "react";
import { Descriptions, Tag, Table, Skeleton, Tabs, Typography } from "antd";
import dayjs from "dayjs";
import { DetailDrawer, StatusTag } from "../../../components/admin";
import { workoutService } from "../services/workoutService";
import { difficultyLabel } from "../data/enumLabels";

const { Paragraph } = Typography;

function OverviewTab({ workout }) {
  return (
    <>
      {workout.tagline && <Paragraph type="secondary">{workout.tagline}</Paragraph>}
      {workout.description && <Paragraph>{workout.description}</Paragraph>}
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item label="Kategori">{workout.categoryName}</Descriptions.Item>
        <Descriptions.Item label="Kas Grubu">{workout.muscleGroupName ?? "—"}</Descriptions.Item>
        <Descriptions.Item label="Zorluk">{difficultyLabel(workout.difficulty)}</Descriptions.Item>
        <Descriptions.Item label="Süre">{workout.durationMin} dk</Descriptions.Item>
        <Descriptions.Item label="Durum"><StatusTag status={workout.isActive ? "Active" : "Inactive"}>{workout.isActive ? "Aktif" : "Pasif"}</StatusTag></Descriptions.Item>
        <Descriptions.Item label="Öne Çıkan">{workout.isFeatured ? <Tag color="blue">Evet</Tag> : "Hayır"}</Descriptions.Item>
        <Descriptions.Item label="Premium">{workout.isPremium ? <Tag color="gold">Evet</Tag> : "Hayır"}</Descriptions.Item>
        <Descriptions.Item label="Yapay Zeka ile Oluşturuldu">{workout.isAiGenerated ? <Tag color="purple">Evet</Tag> : "Hayır"}</Descriptions.Item>
        <Descriptions.Item label="Oluşturulma Tarihi">{dayjs(workout.createdAt).format("DD MMM YYYY")}</Descriptions.Item>
        <Descriptions.Item label="Güncellenme Tarihi">
          {workout.updatedAt ? dayjs(workout.updatedAt).format("DD MMM YYYY") : "—"}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
}

function ExercisesTab({ exercises, loading }) {
  const columns = [
    { title: "#", dataIndex: "order", key: "order", width: 44 },
    { title: "Egzersiz", dataIndex: "exerciseName", key: "exerciseName" },
    { title: "Set", dataIndex: "sets", key: "sets", width: 70 },
    { title: "Tekrar", dataIndex: "reps", key: "reps", width: 70, render: (v) => v ?? "—" },
    { title: "Dinlenme", dataIndex: "restSeconds", key: "restSeconds", width: 90, render: (v) => (v ? `${v}sn` : "—") },
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
  const columns = [{ title: "Ekipman", dataIndex: "equipmentName", key: "equipmentName" }];
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
    <DetailDrawer open={open} title="Antrenman Detayı" width={560} onClose={onClose}>
      {loading || !workout ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <Tabs
          defaultActiveKey="overview"
          items={[
            { key: "overview", label: "Genel Bakış", children: <OverviewTab workout={workout} /> },
            { key: "exercises", label: "Egzersizler", children: <ExercisesTab exercises={exercises} loading={subLoading} /> },
            { key: "equipment", label: "Ekipman", children: <EquipmentTab equipment={equipment} loading={subLoading} /> },
          ]}
        />
      )}
    </DetailDrawer>
  );
}
