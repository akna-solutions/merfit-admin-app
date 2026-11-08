import React, { useState } from "react";
import { Alert, App, Col, Row, Space, Typography } from "antd";
import { SectionCard } from "../../../components/admin";
import ProfileForm from "./ProfileForm";
import SimulationView from "./SimulationView";
import { workoutLabService } from "../services/workoutLabService";
import { useSimulationPolling } from "../hooks/useSimulationPolling";

const { Text } = Typography;

function CatalogStatus({ options }) {
  if (!options) return null;
  const empty = options.activeWorkoutCount === 0;
  return (
    <SectionCard title="Katalog durumu">
      <Space orientation="vertical" size={4}>
        <Text>Aktif antrenman: <b>{options.activeWorkoutCount}</b> (premium {options.activePremiumWorkoutCount})</Text>
        <Text>Puanlanmış antrenman: <b>{options.activeScoredWorkoutCount}</b></Text>
        <Text>Ekipman: <b>{options.equipment?.length ?? 0}</b></Text>
        <Text type="secondary">Kuyrukta bekleyen test: {options.pendingCount}</Text>
        {empty && <Alert type="warning" showIcon title="Aktif antrenman yok; program üretilemez." />}
      </Space>
    </SectionCard>
  );
}

// Yeni test: profil formu -> kayıt (Pending) -> sonuç yoklanır. Kalıcı WorkoutPlan oluşturulmaz.
export default function NewTestTab({ options, optionsError, prefill, onCreated, onRerun, rerunning }) {
  const { message } = App.useApp();
  const [submitting, setSubmitting] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const polling = useSimulationPolling(currentId);

  const handleSubmit = async (request) => {
    setSubmitting(true);
    try {
      const response = await workoutLabService.createSimulation(request);
      setCurrentId(response.data.id);
      onCreated?.(response.data);
    } catch (e) {
      message.error(e?.message || "Test oluşturulamadı.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRerun = async (simulation) => {
    const created = await onRerun?.(simulation);
    if (created?.id) setCurrentId(created.id);
  };

  return (
    <Space orientation="vertical" size={16} style={{ width: "100%" }}>
      {optionsError && <Alert type="error" showIcon title="Form seçenekleri yüklenemedi" description={optionsError} />}
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={18}>
          <ProfileForm
            key={prefill?.key ?? "empty"}
            options={options}
            initialValues={prefill?.values}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        </Col>
        <Col xs={24} xl={6}>
          <CatalogStatus options={options} />
        </Col>
      </Row>
      {currentId && (
        <SectionCard title="Sonuç">
          <SimulationView
            simulation={polling.simulation}
            loading={polling.loading}
            error={polling.error}
            timedOut={polling.timedOut}
            onRefresh={polling.refresh}
            onRerun={handleRerun}
            rerunning={rerunning}
            onEvaluated={(data) => polling.setSimulation(data)}
          />
        </SectionCard>
      )}
    </Space>
  );
}
