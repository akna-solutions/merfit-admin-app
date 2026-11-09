import React from "react";
import { Alert, Button, Result, Space, Spin, Tag, Typography } from "antd";
import { ReloadOutlined, RedoOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { StatusTag } from "../../../components/admin";
import ProgramResult from "./ProgramResult";
import QualityChecklist from "./QualityChecklist";
import EvaluationForm from "./EvaluationForm";
import { SIMULATION_STATUS_COLORS, dayCountLabel, experienceLabel, fitnessGoalLabel, locationLabel, statusLabel } from "../utils/labLabels";

const { Title, Text } = Typography;

/** Testin üst bilgisi + duruma göre bekleme / hata / sonuç görünümü. */
export default function SimulationView({ simulation, loading, error, timedOut, onRefresh, onRerun, rerunning, onEvaluated }) {
  if (error && !simulation) {
    return (
      <Result
        status="error"
        title="Test yüklenemedi"
        subTitle={error}
        extra={onRefresh && <Button icon={<ReloadOutlined />} onClick={onRefresh}>Tekrar dene</Button>}
      />
    );
  }
  if (!simulation) {
    return <div style={{ padding: 48, textAlign: "center" }}><Spin size="large" spinning={loading !== false} /></div>;
  }

  const s = simulation;
  const waiting = s.status === "Pending" || s.status === "Processing";

  return (
    <Space orientation="vertical" size={16} style={{ width: "100%" }}>
      <div className="workout-lab-header">
        <Space orientation="vertical" size={4}>
          <Space wrap size={8}>
            <Title level={5} style={{ margin: 0 }}>{s.name || `Test #${s.id}`}</Title>
            <StatusTag status={s.status} colorMap={SIMULATION_STATUS_COLORS}>{statusLabel(s.status)}</StatusTag>
            {s.algorithmVersion && <Tag>Algoritma {s.algorithmVersion}</Tag>}
            {s.sourceSimulationId && <Tag color="purple">#{s.sourceSimulationId} testinin tekrarı</Tag>}
          </Space>
          <Text type="secondary">
            #{s.id} · {fitnessGoalLabel(s.goal)} · {experienceLabel(s.experienceLevel)} · {locationLabel(s.trainingLocation)} ·{" "}
            {dayCountLabel(s.trainingDaysPerWeek)} · {s.workoutDurationMin ? `${s.workoutDurationMin} dk` : "varsayılan süre"} · {s.isPlus ? "Plus" : "Free"}
            {" · "}
            {dayjs(s.createdAt).format("DD MMM YYYY HH:mm")}
          </Text>
        </Space>
        <Space wrap>
          {onRefresh && <Button icon={<ReloadOutlined />} onClick={onRefresh}>Yenile</Button>}
          {onRerun && !waiting && (
            <Button icon={<RedoOutlined />} onClick={() => onRerun(s)} loading={rerunning}>
              Yeniden çalıştır
            </Button>
          )}
        </Space>
      </div>

      {waiting && !timedOut && (
        <Alert
          type="info"
          showIcon
          icon={<Spin size="small" />}
          title="Program üretiliyor"
          description="Test kuyruğa alındı. Müşteri API'sindeki gerçek algoritma sonucu birkaç saniye içinde yazar."
        />
      )}
      {waiting && timedOut && (
        <Alert
          type="warning"
          showIcon
          title="Sonuç henüz gelmedi"
          description="Test hâlâ kuyrukta. Müşteri API'sinin (MerfitCustomerApi) çalıştığını ve WorkoutPlanLab:Enabled ayarının açık olduğunu kontrol edin, ardından Yenile'ye basın."
        />
      )}
      {s.status === "Failed" && (
        <Alert
          type="error"
          showIcon
          title="Program üretilemedi"
          description={s.errorMessage || "Algoritma bu profil için program üretemedi."}
        />
      )}
      {error && <Alert type="error" showIcon title={error} />}

      {s.status === "Completed" && s.result && (
        <>
          <ProgramResult result={s.result} />
          <QualityChecklist checks={s.qualityChecks} />
        </>
      )}
      {(s.status === "Completed" || s.status === "Failed") && (
        <EvaluationForm key={`${s.id}-${s.evaluation?.evaluatedAt ?? "new"}`} simulation={s} onSaved={onEvaluated} />
      )}
    </Space>
  );
}
