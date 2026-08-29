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
        crumbs={[{ label: "Dashboard", path: "/admin" }, { label: "Gamification" }]}
        title="Gamification"
        description="Manage Merfit Score, achievements, leaderboards and rewards."
      />
      <Tabs
        defaultActiveKey="score"
        items={[
          { key: "score", label: "Merfit Score", children: <ScoreTab /> },
          { key: "achievements", label: "Achievements", children: <AchievementsTab /> },
          { key: "leaderboard", label: "Leaderboard", children: <LeaderboardTab /> },
          { key: "rewards", label: "Rewards", children: <RewardsTab /> },
        ]}
      />
    </PageContainer>
  );
}
