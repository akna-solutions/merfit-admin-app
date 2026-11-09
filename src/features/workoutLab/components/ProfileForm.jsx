import React, { useState } from "react";
import {
  Button, Checkbox, Col, Form, Input, InputNumber, Radio, Row, Select, Space, Tag, Typography,
} from "antd";
import { ExperimentOutlined, UndoOutlined } from "@ant-design/icons";
import { SectionCard } from "../../../components/admin";
import { INITIAL_FORM, sortDays, toRequest, validateForm } from "../utils/profileForm";
import { DAY_CODES, DAY_SHORT_LABELS } from "../utils/labLabels";

const { Text } = Typography;

const optionList = (items = []) => items.map((o) => ({ value: o.value, label: o.label }));

// Onboarding cevaplarını taklit eden profil formu. Boş bırakılan alanlarda gerçek algoritmanın varsayılanları
// kullanılır (süre, hedef, deneyim). Haftalık gün sayısını algoritma belirler; form yalnızca müsait günleri alır.
// Yaş/cinsiyet/boy/kilo kaydedilir ancak antrenman algoritması tarafından kullanılmaz.
export default function ProfileForm({ options, initialValues, submitting, onSubmit }) {
  const [values, setValues] = useState(() => ({ ...INITIAL_FORM, ...(initialValues ?? {}) }));
  const [errors, setErrors] = useState({});

  const set = (patch) => {
    setValues((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      Object.keys(patch).forEach((k) => delete next[k]);
      return next;
    });
  };

  const equipmentCount = options?.equipment?.length ?? 0;
  const isGym = values.trainingLocation === "Gym";
  const targets = options?.targetTrainingDaysByExperience ?? { Beginner: 3, Intermediate: 4, Advanced: 5 };
  const loseWeightExtra = options?.loseWeightExtraTrainingDays ?? 1;
  const availableCount = sortDays(values.availableDays ?? []).length;
  const expectedDays = Math.min(
    6,
    Math.max(2, (targets[values.experienceLevel ?? "Beginner"] ?? 3) + (values.goal === "LoseWeight" ? loseWeightExtra : 0)),
  );
  const defaults = {
    duration: options?.defaultWorkoutDurationMin ?? 45,
    tolerance: options?.durationToleranceMin ?? 15,
  };

  const handleSubmit = () => {
    const found = validateForm(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSubmit?.(toRequest(values));
  };

  const fieldStatus = (key) => (errors[key] ? { validateStatus: "error", help: errors[key] } : {});

  return (
    <SectionCard
      title="Test profili"
      extra={
        <Button icon={<UndoOutlined />} onClick={() => { setValues(INITIAL_FORM); setErrors({}); }}>
          Temizle
        </Button>
      }
    >
      <Form layout="vertical" onFinish={handleSubmit} className="workout-lab-form">
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Test adı" extra="Boş bırakılırsa profilden otomatik ad verilir.">
              <Input
                maxLength={200}
                placeholder="Örn. Başlangıç / ev / ekipmansız"
                value={values.name}
                onChange={(e) => set({ name: e.target.value })}
              />
            </Form.Item>
          </Col>
        </Row>

        <Text strong>Temel bilgiler</Text>
        <Text type="secondary" style={{ display: "block", marginBottom: 12 }}>
          Kayıt amaçlıdır; mevcut antrenman algoritması bu alanları kullanmaz.
        </Text>
        <Row gutter={16}>
          <Col xs={12} md={4}>
            <Form.Item label="Yaş">
              <InputNumber min={13} max={100} style={{ width: "100%" }} value={values.age} onChange={(v) => set({ age: v })} />
            </Form.Item>
          </Col>
          <Col xs={12} md={5}>
            <Form.Item label="Cinsiyet">
              <Select
                allowClear
                placeholder="Seçilmedi"
                options={optionList(options?.genders)}
                value={values.gender}
                onChange={(v) => set({ gender: v })}
              />
            </Form.Item>
          </Col>
          <Col xs={8} md={5}>
            <Form.Item label="Boy (cm)">
              <InputNumber min={100} max={250} style={{ width: "100%" }} value={values.heightCm} onChange={(v) => set({ heightCm: v })} />
            </Form.Item>
          </Col>
          <Col xs={8} md={5}>
            <Form.Item label="Kilo (kg)">
              <InputNumber min={30} max={300} style={{ width: "100%" }} value={values.weightKg} onChange={(v) => set({ weightKg: v })} />
            </Form.Item>
          </Col>
          <Col xs={8} md={5}>
            <Form.Item label="Hedef kilo (kg)">
              <InputNumber min={30} max={300} style={{ width: "100%" }} value={values.targetWeightKg} onChange={(v) => set({ targetWeightKg: v })} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Hedef" extra="Yalnızca güncel üç ana hedef. Boş bırakılırsa algoritma varsayılanı (Kas Geliştirme) kullanılır.">
              <Select
                allowClear
                placeholder="Varsayılan"
                options={optionList(options?.goals)}
                value={values.goal}
                onChange={(v) => set({ goal: v })}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Deneyim seviyesi" extra="Boş bırakılırsa Başlangıç kabul edilir.">
              <Select
                allowClear
                placeholder="Varsayılan"
                options={optionList(options?.experienceLevels)}
                value={values.experienceLevel}
                onChange={(v) => set({ experienceLevel: v })}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Antrenman yeri">
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            options={optionList(options?.trainingLocations)}
            value={values.trainingLocation}
            onChange={(e) => set({ trainingLocation: e.target.value })}
          />
        </Form.Item>

        <Form.Item
          label="Ekipman"
          extra={
            isGym
              ? "Spor salonu her zaman ekipmanlıdır."
              : `Ekipmanlı: katalogdaki tüm ekipmanlar (${equipmentCount}). Ekipmansız: yalnızca vücut ağırlığı.`
          }
        >
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            value={isGym ? true : values.hasEquipment}
            onChange={(e) => set({ hasEquipment: e.target.value })}
            options={[
              { value: true, label: "Ekipmanlı" },
              { value: false, label: "Ekipmansız", disabled: isGym },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Müsait günler"
          extra={
            `Gün sayısını algoritma belirler: bu profil için ${expectedDays} gün` +
            (availableCount > 0 && availableCount < expectedDays ? ` (yalnızca ${availableCount} gün müsait, hepsi kullanılır)` : "") +
            ". Hiçbiri işaretlenmezse tüm hafta müsait sayılır."
          }
          {...fieldStatus("availableDays")}
        >
          <Checkbox.Group
            value={values.availableDays}
            onChange={(days) => set({ availableDays: sortDays(days) })}
            options={DAY_CODES.map((code) => ({ value: code, label: DAY_SHORT_LABELS[code] }))}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Antrenman süresi"
              extra={`Boş bırakılırsa ${defaults.duration} dk. Algoritma +${defaults.tolerance} dk toleransla süzer.`}
            >
              <Select
                allowClear
                placeholder="Varsayılan"
                options={(options?.durationOptions ?? [15, 20, 30, 45, 60, 75, 90]).map((d) => ({ value: d, label: `${d} dk` }))}
                value={values.workoutDurationMin}
                onChange={(v) => set({ workoutDurationMin: v })}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Abonelik" extra="Free kullanıcıya premium antrenmanlar yalnızca son çare olarak açılır.">
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            value={values.isPlus}
            onChange={(e) => set({ isPlus: e.target.value })}
            options={[
              { value: false, label: "Free" },
              { value: true, label: "Plus" },
            ]}
          />
        </Form.Item>

        <Space wrap>
          <Button type="primary" htmlType="submit" icon={<ExperimentOutlined />} loading={submitting}>
            Programı üret
          </Button>
          {options?.latestAlgorithmVersion && (
            <Tag>Son algoritma sürümü: {options.latestAlgorithmVersion}</Tag>
          )}
        </Space>
      </Form>
    </SectionCard>
  );
}
