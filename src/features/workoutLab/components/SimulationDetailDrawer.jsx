import React from "react";
import { DetailDrawer } from "../../../components/admin";
import SimulationView from "./SimulationView";
import { useSimulationPolling } from "../hooks/useSimulationPolling";

export default function SimulationDetailDrawer({ simulationId, onClose, onRerun, rerunning, onChanged }) {
  const polling = useSimulationPolling(simulationId);
  return (
    <DetailDrawer open={Boolean(simulationId)} onClose={onClose} title="Test detayı" width="min(1100px, 100vw)">
      <SimulationView
        simulation={polling.simulation}
        loading={polling.loading}
        error={polling.error}
        timedOut={polling.timedOut}
        onRefresh={polling.refresh}
        onRerun={onRerun}
        rerunning={rerunning}
        onEvaluated={(data) => {
          polling.setSimulation(data);
          onChanged?.();
        }}
      />
    </DetailDrawer>
  );
}
