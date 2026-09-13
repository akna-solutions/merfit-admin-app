import React from "react";
import { Tabs } from "antd";
import { PageHeader, PageContainer } from "../../../components/admin";
import ScoreTab from "../components/ScoreTab";
import AchievementsTab from "../components/AchievementsTab";
import LeaderboardTab from "../components/LeaderboardTab";
import RewardsTab from "../components/RewardsTab";

export default function GamificationPage() {
  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: "Kontrol Paneli", path: "/admin" }, { label: "Oyunlaştırma" }]}
        title="Oyunlaştırma"
        description="MB Fit Skoru, başarıları, liderlik tablolarını ve ödülleri yönetin."
      />
      <Tabs
        defaultActiveKey="score"
        items={[
          { key: "score", label: "MB Fit Skoru", children: <ScoreTab /> },
          { key: "achievements", label: "Başarılar", children: <AchievementsTab /> },
          { key: "leaderboard", label: "Liderlik Tablosu", children: <LeaderboardTab /> },
          { key: "rewards", label: "Ödüller", children: <RewardsTab /> },
        ]}
      />
    </PageContainer>
  );
}
