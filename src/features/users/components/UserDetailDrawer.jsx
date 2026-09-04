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
      <Descriptions.Item label="Ad Soyad">
        {profile.firstName} {profile.lastName}
      </Descriptions.Item>
      <Descriptions.Item label="Kullanıcı Adı">@{profile.username}</Descriptions.Item>
      <Descriptions.Item label="E-posta">{user.email}</Descriptions.Item>
      <Descriptions.Item label="Telefon">{user.phoneNumber || "—"}</Descriptions.Item>
      <Descriptions.Item label="Cinsiyet">{enumLabel(GENDER, profile.gender) ?? "—"}</Descriptions.Item>
      <Descriptions.Item label="Hedef">{enumLabel(FITNESS_GOAL, profile.goal) ?? "—"}</Descriptions.Item>
      <Descriptions.Item label="Deneyim Seviyesi">
        {enumLabel(EXPERIENCE_LEVEL, profile.experienceLevel) ?? "—"}
      </Descriptions.Item>
      <Descriptions.Item label="Aktivite Seviyesi">
        {enumLabel(ACTIVITY_LEVEL, profile.activityLevel) ?? "—"}
      </Descriptions.Item>
      <Descriptions.Item label="Antrenman Ortamı">
        {enumLabel(TRAINING_LOCATION, profile.trainingLocation) ?? "—"}
      </Descriptions.Item>
      <Descriptions.Item label="Boy">{profile.heightCm ? `${profile.heightCm} cm` : "—"}</Descriptions.Item>
      <Descriptions.Item label="Kilo">{profile.weightKg ? `${profile.weightKg} kg` : "—"}</Descriptions.Item>
    </Descriptions>
  );
}

const ACCOUNT_STATUS_LABEL_TR = { Deleted: "Silindi", Active: "Aktif", Inactive: "Pasif" };

function AccountTab({ user }) {
  const status = user.isDeleted ? "Deleted" : user.isActive ? "Active" : "Inactive";
  return (
    <Descriptions column={1} bordered size="small">
      <Descriptions.Item label="Durum">
        <StatusTag status={status}>{ACCOUNT_STATUS_LABEL_TR[status]}</StatusTag>
      </Descriptions.Item>
      <Descriptions.Item label="Rol">{user.role}</Descriptions.Item>
      <Descriptions.Item label="E-posta Onaylandı mı">{user.emailConfirmed ? "Evet" : "Hayır"}</Descriptions.Item>
      <Descriptions.Item label="Oluşturulma Tarihi">
        {dayjs(user.createdAt).format("DD MMM YYYY, HH:mm")}
      </Descriptions.Item>
      <Descriptions.Item label="Son Giriş">
        {user.lastLoginAt ? dayjs(user.lastLoginAt).format("DD MMM YYYY, HH:mm") : "Hiç"}
      </Descriptions.Item>
      {user.isDeleted && (
        <Descriptions.Item label="Silinme Tarihi">
          {dayjs(user.deletedAt).format("DD MMM YYYY, HH:mm")}
        </Descriptions.Item>
      )}
      <Descriptions.Item label="Kullanıcı ID">{user.id}</Descriptions.Item>
    </Descriptions>
  );
}

const SUBSCRIPTION_STATUS_LABEL_TR = { active: "Aktif", expired: "Süresi Doldu", cancelled: "İptal Edildi" };

function SubscriptionTab({ user, subscriptions }) {
  const columns = [
    { title: "Ürün", dataIndex: "productName", key: "productName" },
    { title: "Sağlayıcı", dataIndex: "provider", key: "provider" },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      render: (v) => <StatusTag status={v}>{SUBSCRIPTION_STATUS_LABEL_TR[v] ?? v}</StatusTag>,
    },
    { title: "Başlangıç", dataIndex: "startedAt", key: "startedAt", render: (v) => dayjs(v).format("DD MMM YYYY") },
    { title: "Bitiş", dataIndex: "expiresAt", key: "expiresAt", render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : "—") },
    { title: "Otomatik Yenileme", dataIndex: "autoRenew", key: "autoRenew", render: (v) => (v ? "Evet" : "Hayır") },
  ];
  return (
    <>
      <Descriptions column={1} size="small" bordered style={{ marginBottom: 16 }}>
        <Descriptions.Item label="Mevcut Durum">
          {user.currentSubscriptionStatus ? (
            <Tag color="gold">{SUBSCRIPTION_STATUS_LABEL_TR[user.currentSubscriptionStatus] ?? user.currentSubscriptionStatus}</Tag>
          ) : (
            <Tag>Yok</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Mevcut Ürün">
          {user.currentSubscriptionProductName ?? "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Bitiş Tarihi">
          {user.currentSubscriptionExpiresAt ? dayjs(user.currentSubscriptionExpiresAt).format("DD MMM YYYY") : "—"}
        </Descriptions.Item>
      </Descriptions>
      {subscriptions?.length ? (
        <Table columns={columns} dataSource={subscriptions} rowKey="id" size="small" pagination={false} />
      ) : (
        <Empty description="Abonelik geçmişi bulunmuyor." />
      )}
    </>
  );
}

function WorkoutActivityTab({ data }) {
  const columns = [
    { title: "Antrenman", dataIndex: "workoutTitle", key: "workoutTitle" },
    { title: "Başlangıç", dataIndex: "startedAt", key: "startedAt", render: (v) => dayjs(v).format("DD MMM") },
    {
      title: "Süre",
      dataIndex: "durationSeconds",
      key: "durationSeconds",
      render: (v) => `${Math.round(v / 60)} dk`,
    },
    { title: "Kalori", dataIndex: "caloriesBurned", key: "caloriesBurned" },
    {
      title: "Durum",
      key: "status",
      render: (_, r) => (
        <StatusTag status={r.completedAt ? "Completed" : "In Progress"} colorMap={{ completed: "green", in_progress: "blue" }}>
          {r.completedAt ? "Tamamlandı" : "Devam Ediyor"}
        </StatusTag>
      ),
    },
  ];
  return <Table columns={columns} dataSource={data} rowKey="id" size="small" pagination={false} />;
}

function NutritionTab({ meals, goal }) {
  const columns = [
    { title: "Tarih", dataIndex: "date", key: "date", render: (v) => dayjs(v).format("DD MMM") },
    { title: "Öğe Sayısı", dataIndex: "itemCount", key: "itemCount" },
    { title: "Kalori", dataIndex: "totalCalories", key: "totalCalories" },
  ];
  return (
    <>
      {goal ? (
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col span={12}><Card size="small"><Statistic title="Günlük Kalori Hedefi" value={goal.dailyCalories} /></Card></Col>
          <Col span={12}><Card size="small"><Statistic title="Protein Hedefi" value={goal.proteinTarget} suffix="g" /></Card></Col>
        </Row>
      ) : (
        <Empty description="Beslenme hedefi belirlenmemiş." style={{ marginBottom: 16 }} />
      )}
      <Table columns={columns} dataSource={meals} rowKey="id" size="small" pagination={false} />
    </>
  );
}

function MeasurementsTab({ measurements }) {
  const latest = measurements?.[0];
  if (!latest) return <Empty description="Ölçüm kaydı bulunmuyor." />;
  return (
    <Row gutter={[12, 12]}>
      <Col span={12}><Card size="small"><Statistic title="Kilo" value={latest.weightKg} suffix="kg" /></Card></Col>
      <Col span={12}><Card size="small"><Statistic title="Vücut Yağı" value={latest.bodyFatPercentage} suffix="%" /></Card></Col>
      <Col span={12}><Card size="small"><Statistic title="BMI" value={latest.bmi} /></Card></Col>
      <Col span={12}><Card size="small"><Statistic title="Bel Çevresi" value={latest.waistCm} suffix="cm" /></Card></Col>
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
  if (!achievements?.length) return <Empty description="Henüz başarı yok." />;
  return (
    <Row gutter={[12, 12]}>
      {achievements.map((a) => (
        <Col span={12} key={a.achievementId}>
          <Card size="small">
            <div style={{ fontSize: 24 }}>{a.icon}</div>
            <div style={{ fontWeight: 600, marginTop: 4 }}>{a.title}</div>
            <div style={{ fontSize: 12, color: "#98A2B3" }}>
              {dayjs(a.earnedAt).format("DD MMM YYYY")} · {a.points} puan
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

function DevicesTab({ devices }) {
  if (!devices?.length) return <Empty description="Bağlı cihaz bulunmuyor." />;
  const columns = [
    { title: "Cihaz", dataIndex: "deviceName", key: "deviceName" },
    { title: "Platform", dataIndex: "platform", key: "platform", render: (v) => enumLabel(PLATFORM, v) ?? "—" },
    { title: "Uygulama Sürümü", dataIndex: "appVersion", key: "appVersion" },
    { title: "Son Görülme", dataIndex: "lastSeenAt", key: "lastSeenAt", render: (v) => dayjs(v).format("DD MMM YYYY") },
  ];
  return <Table columns={columns} dataSource={devices} rowKey="id" size="small" pagination={false} />;
}

const TICKET_STATUS_LABEL_TR = { Resolved: "Çözüldü", Open: "Açık" };

function SupportTicketsTab({ tickets }) {
  if (!tickets?.length) return <Empty description="Destek talebi bulunmuyor." />;
  const columns = [
    { title: "Talep", dataIndex: "id", key: "id" },
    { title: "Konu", dataIndex: "subject", key: "subject" },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      render: (v) => <StatusTag status={v}>{TICKET_STATUS_LABEL_TR[v] ?? v}</StatusTag>,
    },
    { title: "Oluşturulma", dataIndex: "createdAt", key: "createdAt", render: (v) => dayjs(v).format("DD MMM YYYY") },
  ];
  return <Table columns={columns} dataSource={tickets} rowKey="id" size="small" pagination={false} />;
}

export default function UserDetailDrawer({ open, user, related, loading, onClose }) {
  return (
    <DetailDrawer open={open} title="Kullanıcı Detayı" width={640} onClose={onClose}>
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
              { key: "profile", label: "Profil", children: <ProfileTab user={user} /> },
              { key: "account", label: "Hesap", children: <AccountTab user={user} /> },
              { key: "subscription", label: "Abonelik", children: <SubscriptionTab user={user} subscriptions={related.subscriptions} /> },
              { key: "workout", label: "Antrenman Aktivitesi", children: <WorkoutActivityTab data={related.workoutSessions} /> },
              { key: "nutrition", label: "Beslenme", children: <NutritionTab meals={related.meals} goal={related.nutritionGoal} /> },
              { key: "measurements", label: "Ölçümler", children: <MeasurementsTab measurements={related.measurements} /> },
              { key: "score", label: "Merfit Skoru", children: <MerfitScoreTab user={user} breakdown={related.scoreBreakdown} /> },
              { key: "achievements", label: "Başarılar", children: <AchievementsTab achievements={related.achievements} /> },
              { key: "devices", label: "Cihazlar", children: <DevicesTab devices={related.devices} /> },
              { key: "support", label: "Destek Talepleri", children: <SupportTicketsTab tickets={related.supportTickets} /> },
            ]}
          />
        </>
      )}
    </DetailDrawer>
  );
}
