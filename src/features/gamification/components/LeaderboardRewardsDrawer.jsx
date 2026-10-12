import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, InputNumber, Select, Space, Typography, App, Popconfirm } from "antd";
import { DeleteOutlined, GiftOutlined, PlusOutlined } from "@ant-design/icons";
import { DetailDrawer, DataTable } from "../../../components/admin";
import { rewardService, leaderboardService, LEADERBOARD_PERIOD_TYPE_LABELS } from "../services/gamificationService";

const { Text } = Typography;

// Bir dönemin hangi sırasına hangi ödülün verileceğini yönetir. Mobil uygulamadaki
// "Ödüller" bölümü bu tanımlardan beslenir; dönem bitince "Hediyeleri Dağıt" kazananlara
// ödüllerini (UserReward) atar ve kullanıcı bunları uygulamada "Hediyelerim" altında görür.
export default function LeaderboardRewardsDrawer({ open, period, onClose }) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [links, setLinks] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [distributing, setDistributing] = useState(false);

  const load = useCallback(async () => {
    if (!period) return;
    setLoading(true);
    try {
      const [linksRes, rewardsRes] = await Promise.all([
        rewardService.getLeaderboardRewards({ leaderboardPeriodId: period.id, pageSize: 100 }),
        rewardService.getRewards({ isActive: true, pageSize: 100 }),
      ]);
      setLinks([...linksRes.data.items].sort((a, b) => a.rank - b.rank));
      setRewards(rewardsRes.data.items);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [period, message]);

  useEffect(() => {
    if (open) {
      form.resetFields();
      load();
    }
  }, [open, load, form]);

  const handleAdd = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      const existing = links.find((l) => l.rank === values.rank);
      const payload = { leaderboardPeriodId: period.id, rank: values.rank, rewardId: values.rewardId };
      if (existing) {
        await rewardService.updateLeaderboardReward(existing.id, payload);
        message.success(`#${values.rank} ödülü güncellendi.`);
      } else {
        await rewardService.createLeaderboardReward(payload);
        message.success(`#${values.rank} için ödül eklendi.`);
      }
      form.resetFields();
      load();
    } catch (error) {
      message.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (record) => {
    try {
      await rewardService.deleteLeaderboardReward(record.id);
      message.success(`#${record.rank} ödülü kaldırıldı.`);
      load();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleDistribute = async () => {
    setDistributing(true);
    try {
      const res = await leaderboardService.distributeRewards(period.id);
      const { createdCount, skippedCount } = res.data;
      message.success(
        createdCount > 0
          ? `${createdCount} kullanıcıya hediyesi atandı.${skippedCount ? ` ${skippedCount} kayıt zaten vardı.` : ""}`
          : "Atanacak yeni hediye yok.",
      );
    } catch (error) {
      message.error(error.message);
    } finally {
      setDistributing(false);
    }
  };

  const columns = [
    { title: "Sıra", dataIndex: "rank", key: "rank", width: 80, render: (v) => `#${v}` },
    { title: "Ödül", dataIndex: "rewardTitle", key: "rewardTitle" },
    {
      title: "",
      key: "actions",
      width: 56,
      render: (_, record) => (
        <Popconfirm title={`#${record.rank} ödülü kaldırılsın mı?`} onConfirm={() => handleDelete(record)}>
          <Button type="text" danger size="small" icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <DetailDrawer
      open={open}
      title={`${LEADERBOARD_PERIOD_TYPE_LABELS[period?.type] ?? period?.type ?? ""} Dönem Ödülleri`}
      width={560}
      onClose={onClose}
      extra={
        <Popconfirm
          title="Hediyeler dağıtılsın mı?"
          description="Sıralama yeniden hesaplanır ve ödül tanımlı sıralardaki kullanıcılara hediyeleri atanır."
          onConfirm={handleDistribute}
          disabled={links.length === 0}
        >
          <Button size="small" type="primary" icon={<GiftOutlined />} loading={distributing} disabled={links.length === 0}>
            Hediyeleri Dağıt
          </Button>
        </Popconfirm>
      }
    >
      <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
        Mobil uygulamada bu dönem aktifken ve bugünü kapsarken bu ödüller gösterilir.
      </Text>

      <Form form={form} layout="inline" style={{ marginBottom: 16, rowGap: 8 }}>
        <Form.Item name="rank" rules={[{ required: true, message: "Sıra zorunlu" }]}>
          <InputNumber min={1} max={100000} placeholder="Sıra" style={{ width: 90 }} />
        </Form.Item>
        <Form.Item name="rewardId" rules={[{ required: true, message: "Ödül seçin" }]} style={{ flex: 1, minWidth: 200 }}>
          <Select
            placeholder="Ödül seçin"
            showSearch
            optionFilterProp="label"
            options={rewards.map((r) => ({ value: r.id, label: r.title }))}
            notFoundContent={loading ? "Yükleniyor..." : "Önce Ödüller sekmesinden aktif bir ödül oluşturun"}
          />
        </Form.Item>
        <Space>
          <Button icon={<PlusOutlined />} onClick={handleAdd} loading={saving}>
            Ekle
          </Button>
        </Space>
      </Form>

      <DataTable
        columns={columns}
        dataSource={links}
        loading={loading}
        pagination={false}
        scrollX={420}
        emptyDescription="Bu döneme henüz ödül atanmadı."
      />
    </DetailDrawer>
  );
}
