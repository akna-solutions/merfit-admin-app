import React, { useCallback, useEffect, useState } from "react";
import { App, Tabs } from "antd";
import { PageContainer, PageHeader } from "../../../components/admin";
import NewTestTab from "../components/NewTestTab";
import HistoryTab from "../components/HistoryTab";
import CompareView from "../components/CompareView";
import { workoutLabService } from "../services/workoutLabService";
import { fromProfile } from "../utils/profileForm";
import "../workoutLab.css";

// Antrenman Laboratuvarı: onboarding cevaplarını taklit eden test profilleriyle gerçek WorkoutPlanGenerator'ı
// (MerfitCustomerApi) çalıştırır, sonucu kontrol eder, değerlendirir ve sürümler arasında karşılaştırır.
// Gerçek kullanıcı, plan, bildirim veya iş oluşturulmaz.
export default function WorkoutLabPage() {
  const { message } = App.useApp();
  const [activeTab, setActiveTab] = useState("new");
  const [options, setOptions] = useState(null);
  const [optionsError, setOptionsError] = useState(null);
  const [prefill, setPrefill] = useState(null);
  const [historyKey, setHistoryKey] = useState(0);
  const [compareIds, setCompareIds] = useState({ left: null, right: null });
  const [rerunning, setRerunning] = useState(false);

  const loadOptions = useCallback(async () => {
    try {
      const response = await workoutLabService.getOptions();
      setOptions(response.data);
      setOptionsError(null);
    } catch (e) {
      setOptionsError(e?.message || "Seçenekler alınamadı.");
    }
  }, []);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  const handleRerun = useCallback(
    async (simulation) => {
      setRerunning(true);
      try {
        const response = await workoutLabService.rerun(simulation.id);
        message.success(`Test #${simulation.id} yeniden çalıştırıldı (yeni test #${response.data.id}).`);
        setHistoryKey((k) => k + 1);
        return response.data;
      } catch (e) {
        message.error(e?.message || "Test yeniden çalıştırılamadı.");
        return null;
      } finally {
        setRerunning(false);
      }
    },
    [message],
  );

  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: "Panel", path: "/admin" }, { label: "Antrenman Laboratuvarı" }]}
        title="Antrenman Laboratuvarı"
        description="Test profilleriyle gerçek antrenman programı algoritmasını çalıştırın, sonucu kontrol edin, değerlendirin ve sürümleri karşılaştırın. Gerçek kullanıcılar ve planları etkilenmez."
      />
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        destroyOnHidden={false}
        items={[
          {
            key: "new",
            label: "Yeni test",
            children: (
              <NewTestTab
                options={options}
                optionsError={optionsError}
                prefill={prefill}
                onCreated={() => {
                  setHistoryKey((k) => k + 1);
                  loadOptions();
                }}
                onRerun={handleRerun}
                rerunning={rerunning}
              />
            ),
          },
          {
            key: "history",
            label: "Geçmiş",
            children: (
              <HistoryTab
                refreshKey={historyKey}
                rerunning={rerunning}
                onRerun={handleRerun}
                onEditProfile={(sim) => {
                  setPrefill({ key: `${sim.id}-${Date.now()}`, values: fromProfile(sim.profile ?? {}, sim.name ? `${sim.name} (kopya)` : "") });
                  setActiveTab("new");
                }}
                onCompare={(left, right) => {
                  setCompareIds({ left, right });
                  setActiveTab("compare");
                }}
              />
            ),
          },
          {
            key: "compare",
            label: "Karşılaştırma",
            children: <CompareView initialLeftId={compareIds.left} initialRightId={compareIds.right} />,
          },
        ]}
      />
    </PageContainer>
  );
}
