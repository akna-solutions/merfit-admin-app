import React from "react";
import {
  Avatar,
  Tabs,
  Descriptions,
  Card,
  Statistic,
  Table,
  Row,
  Col,
  Tag,
  Progress,
  Empty,
  Skeleton,
} from "antd";
import dayjs from "dayjs";
import { DetailDrawer, StatusTag } from "../../../components/admin";
import {
  GENDER, FITNESS_GOAL, EXPERIENCE_LEVEL, ACTIVITY_LEVEL, TRAINING_LOCATION, PLATFORM, enumLabel,
} from "../../../constants/apiEnums";

// Renders AdminUserDetailDto + the per-tab sub-resources fetched alongside it
// (see userService.js — each maps 1:1 to an AdminUserController endpoint).
// Gender/Goal/ExperienceLevel/ActivityLevel/TrainingLocation/Platform arrive
// from the real API as raw enum integers (see constants/apiEnums.js), so
// every raw-enum field is converted through enumLabel() before display.

function ProfileTab({ user }) {
  const { profile } = user;
  return (
    <Descriptions column={1} bordered size="small">
      <Descriptions.Item label="Full Name">
        {profile.firstName} {profile.lastName}
      </Descriptions.Item>
      <Descriptions.Item label="Username">@{profile.username}</Descriptions.Item>
      <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
      <Descriptions.Item label="Phone">{user.phoneNumber || "—"}</Descriptions.Item>
      <Descriptions.Item label="Gender">{enumLabel(GENDER, profile.gender) ?? "—"}</Descriptions.Item>
      <Descriptions.Item label="Goal">{enumLabel(FITNESS_GOAL, profile.goal) ?? "—"}</Descriptions.Item>
      <Descriptions.Item label="Experience Level">
        {enumLabel(EXPERIENCE_LEVEL, profile.experienceLevel) ?? "—"}
      </Descriptions.Item>
      <Descriptions.Item label="Activity Level">
        {enumLabel(ACTIVITY_LEVEL, profile.activityLevel) ?? "—"}
      </Descriptions.Item>
      <Descriptions.Item label="Training Location">
        {enumLabel(TRAINING_LOCATION, profile.trainingLocation) ?? "—"}
      </Descriptions.Item>
      <Descriptions.Item label="Height">{profile.heightCm ? `${profile.heightCm} cm` : "—"}</Descriptions.Item>
      <Descriptions.Item label="Weight">{profile.weightKg ? `${profile.weightKg} kg` : "—"}</Descriptions.Item>
    </Descriptions>
  );
}

function AccountTab({ user }) {
  const status = user.isDeleted ? "Deleted" : user.isActive ? "Active" : "Inactive";
  return (
    <Descriptions column={1} bordered size="small">
      <Descriptions.Item label="Status">
        <StatusTag status={status} />
      </Descriptions.Item>
      <Descriptions.Item label="Role">{user.role}</Descriptions.Item>
      <Descriptions.Item label="Email Confirmed">{user.emailConfirmed ? "Yes" : "No"}</Descriptions.Item>
      <Descriptions.Item label="Created At">
        {dayjs(user.createdAt).format("DD MMM YYYY, HH:mm")}
      </Descriptions.Item>
      <Descriptions.Item label="Last Login">
        {user.lastLoginAt ? dayjs(user.lastLoginAt).format("DD MMM YYYY, HH:mm") : "Never"}
      </Descriptions.Item>
      {user.isDeleted && (
        <Descriptions.Item label="Deleted At">
          {dayjs(user.deletedAt).format("DD MMM YYYY, HH:mm")}
        </Descriptions.Item>
      )}
      <Descriptions.Item label="User ID">{user.id}</Descriptions.Item>
    </Descriptions>
  );
}

function SubscriptionTab({ user, subscriptions }) {
  const columns = [
    { title: "Product", dataIndex: "productName", key: "productName" },
    { title: "Provider", dataIndex: "provider", key: "provider" },
    { title: "Status", dataIndex: "status", key: "status", render: (v) => <StatusTag status={v} /> },
    { title: "Started", dataIndex: "startedAt", key: "startedAt", render: (v) => dayjs(v).format("DD MMM YYYY") },
    { title: "Expires", dataIndex: "expiresAt", key: "expiresAt", render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : "—") },
    { title: "Auto Renew", dataIndex: "autoRenew", key: "autoRenew", render: (v) => (v ? "Yes" : "No") },
  ];
  return (
    <>
      <Descriptions column={1} size="small" bordered style={{ marginBottom: 16 }}>
        <Descriptions.Item label="Current Status">
          {user.currentSubscriptionStatus ? <Tag color="gold">{user.currentSubscriptionStatus}</Tag> : <Tag>None</Tag>}
        </Descriptions.Item>
        <Descriptions.Item label="Current Product">
          {user.currentSubscriptionProductName ?? "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Expires At">
          {user.currentSubscriptionExpiresAt ? dayjs(user.currentSubscriptionExpiresAt).format("DD MMM YYYY") : "—"}
        </Descriptions.Item>
      </Descriptions>
      {subscriptions?.length ? (
        <Table columns={columns} dataSource={subscriptions} rowKey="id" size="small" pagination={false} />
      ) : (
        <Empty description="No subscription history." />
      )}
    </>
  );
}

function WorkoutActivityTab({ data }) {
  const columns = [
    { title: "Workout", dataIndex: "workoutTitle", key: "workoutTitle" },
    { title: "Started", dataIndex: "startedAt", key: "startedAt", render: (v) => dayjs(v).format("DD MMM") },
    {
      title: "Duration",
      dataIndex: "durationSeconds",
      key: "durationSeconds",
      render: (v) => `${Math.round(v / 60)} min`,
    },
    { title: "Calories", dataIndex: "caloriesBurned", key: "caloriesBurned" },
    {
      title: "Status",
      key: "status",
      render: (_, r) => <StatusTag status={r.completedAt ? "Completed" : "In Progress"} colorMap={{ completed: "green", in_progress: "blue" }} />,
    },
  ];
  return <Table columns={columns} dataSource={data} rowKey="id" size="small" pagination={false} />;
}

function NutritionTab({ meals, goal }) {
  const columns = [
    { title: "Date", dataIndex: "date", key: "date", render: (v) => dayjs(v).format("DD MMM") },
    { title: "Items", dataIndex: "itemCount", key: "itemCount" },
    { title: "Calories", dataIndex: "totalCalories", key: "totalCalories" },
  ];
  return (
    <>
      {goal ? (
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col span={12}><Card size="small"><Statistic title="Daily Calorie Target" value={goal.dailyCalories} /></Card></Col>
          <Col span={12}><Card size="small"><Statistic title="Protein Target" value={goal.proteinTarget} suffix="g" /></Card></Col>
        </Row>
      ) : (
        <Empty description="No nutrition goal set." style={{ marginBottom: 16 }} />
      )}
      <Table columns={columns} dataSource={meals} rowKey="id" size="small" pagination={false} />
    </>
  );
}

function MeasurementsTab({ measurements }) {
  const latest = measurements?.[0];
  if (!latest) return <Empty description="No measurements recorded." />;
  return (
    <Row gutter={[12, 12]}>
      <Col span={12}><Card size="small"><Statistic title="Weight" value={latest.weightKg} suffix="kg" /></Card></Col>
      <Col span={12}><Card size="small"><Statistic title="Body Fat" value={latest.bodyFatPercentage} suffix="%" /></Card></Col>
      <Col span={12}><Card size="small"><Statistic title="BMI" value={latest.bmi} /></Card></Col>
      <Col span={12}><Card size="small"><Statistic title="Waist" value={latest.waistCm} suffix="cm" /></Card></Col>
    </Row>
  );
}

function MerfitScoreTab({ user, breakdown }) {
  return (
    <Card size="small">
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <Progress type="dashboard" percent={user.latestMerfitScore ?? 0} format={(p) => `${p}`} />
      </div>
      <Descriptions column={1} size="small" bordered>
        {breakdown?.map((b) => (
          <Descriptions.Item label={b.category} key={b.category}>
            {b.points}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Card>
  );
}

function AchievementsTab({ achievements }) {
  if (!achievements?.length) return <Empty description="No achievements yet." />;
  return (
    <Row gutter={[12, 12]}>
      {achievements.map((a) => (
        <Col span={12} key={a.achievementId}>
          <Card size="small">
            <div style={{ fontSize: 24 }}>{a.icon}</div>
            <div style={{ fontWeight: 600, marginTop: 4 }}>{a.title}</div>
            <div style={{ fontSize: 12, color: "#98A2B3" }}>
              {dayjs(a.earnedAt).format("DD MMM YYYY")} · {a.points} pts
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

function DevicesTab({ devices }) {
  if (!devices?.length) return <Empty description="No linked devices." />;
  const columns = [
    { title: "Device", dataIndex: "deviceName", key: "deviceName" },
    { title: "Platform", dataIndex: "platform", key: "platform", render: (v) => enumLabel(PLATFORM, v) ?? "—" },
    { title: "App Version", dataIndex: "appVersion", key: "appVersion" },
    { title: "Last Seen", dataIndex: "lastSeenAt", key: "lastSeenAt", render: (v) => dayjs(v).format("DD MMM YYYY") },
  ];
  return <Table columns={columns} dataSource={devices} rowKey="id" size="small" pagination={false} />;
}

function SupportTicketsTab({ tickets }) {
  if (!tickets?.length) return <Empty description="No support tickets." />;
  const columns = [
    { title: "Ticket", dataIndex: "id", key: "id" },
    { title: "Subject", dataIndex: "subject", key: "subject" },
    { title: "Status", dataIndex: "status", key: "status", render: (v) => <StatusTag status={v} /> },
    { title: "Created", dataIndex: "createdAt", key: "createdAt", render: (v) => dayjs(v).format("DD MMM YYYY") },
  ];
  return <Table columns={columns} dataSource={tickets} rowKey="id" size="small" pagination={false} />;
}

export default function UserDetailDrawer({ open, user, related, loading, onClose }) {
  return (
    <DetailDrawer open={open} title="User Detail" width={640} onClose={onClose}>
      {loading || !user ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <>
          <div className="merfit-detail-header">
            <Avatar size={56} style={{ backgroundColor: user.avatarColor }}>
              {user.profile.firstName.charAt(0).toUpperCase()}
            </Avatar>
            <div className="merfit-detail-header-text">
              <div className="merfit-detail-header-title">
                {user.profile.firstName} {user.profile.lastName}
              </div>
              <div className="merfit-detail-header-sub">
                @{user.profile.username} · {user.email}
              </div>
            </div>
          </div>
          <Tabs
            defaultActiveKey="profile"
            items={[
              { key: "profile", label: "Profile", children: <ProfileTab user={user} /> },
              { key: "account", label: "Account", children: <AccountTab user={user} /> },
              { key: "subscription", label: "Subscription", children: <SubscriptionTab user={user} subscriptions={related.subscriptions} /> },
              { key: "workout", label: "Workout Activity", children: <WorkoutActivityTab data={related.workoutSessions} /> },
              { key: "nutrition", label: "Nutrition", children: <NutritionTab meals={related.meals} goal={related.nutritionGoal} /> },
              { key: "measurements", label: "Measurements", children: <MeasurementsTab measurements={related.measurements} /> },
              { key: "score", label: "Merfit Score", children: <MerfitScoreTab user={user} breakdown={related.scoreBreakdown} /> },
              { key: "achievements", label: "Achievements", children: <AchievementsTab achievements={related.achievements} /> },
              { key: "devices", label: "Devices", children: <DevicesTab devices={related.devices} /> },
              { key: "support", label: "Support Tickets", children: <SupportTicketsTab tickets={related.supportTickets} /> },
            ]}
          />
        </>
      )}
    </DetailDrawer>
  );
}
