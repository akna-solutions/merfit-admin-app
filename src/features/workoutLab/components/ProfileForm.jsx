import React, { useMemo, useState } from "react";
import {
  Alert, Button, Checkbox, Col, Form, Input, InputNumber, Radio, Row, Select, Space, Switch, Tag, Typography,
} from "antd";
import { ExperimentOutlined, UndoOutlined } from "@ant-design/icons";
import { SectionCard } from "../../../components/admin";
import { INITIAL_FORM, applyEquipmentChange, sortDays, toRequest, validateForm } from "../utils/profileForm";
import { DAY_CODES, DAY_SHORT_LABELS } from "../utils/labLabels";

const { Text } = Typography;

const optionList = (items = []) => items.map((o) => ({ value: o.value, label: o.label }));

// Onboarding cevaplarını taklit eden profil formu. Boş bırakılan alanlarda gerçek algoritmanın varsayılanları
// kullanılır (gün sayısı, süre, hedef, deneyim). Yaş/cinsiyet/boy/kilo kaydedilir ancak antrenman algoritması
// tarafından kullanılmaz.
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

  const equipmentOptions = useMemo(
    () => (options?.equipment ?? []).map((e) => ({ value: e.id, label: e.name })),
    [options],
  );
  const isGym = values.trainingLocation === "Gym";
  const defaults = {
    days: options?.defaultTrainingDaysPerWeek ?? 3,
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

        {isGym ? (
          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
            title="Spor salonunda ekipman seçilmez."
            description={`Mobil onboarding ile aynı şekilde katalogdaki tüm ekipmanlar (${equipmentOptions.length}) algoritmaya verilir.`}
          />
        ) : (
          <Form.Item label="Ekipmanlar" {...fieldStatus("equipmentIds")}>
            <Space orientation="vertical" style={{ width: "100%" }}>
              <Checkbox
                checked={values.noEquipment}
                onChange={(e) => setValues((prev) => applyEquipmentChange(prev, { noEquipment: e.target.checked }))}
              >
                Hiç ekipmanım yok
              </Checkbox>
              <Select
                mode="multiple"
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder={equipmentOptions.length ? "Ekipman seçin" : "Katalogda ekipman yok"}
                disabled={values.noEquipment}
                options={equipmentOptions}
                value={values.equipmentIds}
                onChange={(ids) => {
                  setValues((prev) => applyEquipmentChange(prev, { equipmentIds: ids }));
                  setErrors((prev) => ({ ...prev, equipmentIds: undefined }));
                }}
                style={{ width: "100%" }}
              />
            </Space>
          </Form.Item>
        )}

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Haftalık antrenman günü" extra={`Boş bırakılırsa ${defaults.days} gün.`}>
              <Select
                allowClear
                placeholder="Varsayılan"
                disabled={values.useSpecificDays}
                options={(options?.trainingDaysPerWeekOptions ?? [2, 3, 4, 5, 6, 7]).map((d) => ({ value: d, label: `${d} gün` }))}
                value={values.useSpecificDays ? sortDays(values.trainingDays).length || undefined : values.trainingDaysPerWeek}
                onChange={(v) => set({ trainingDaysPerWeek: v })}
              />
            </Form.Item>
          </Col>
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

        <Form.Item label="Belirli günler" {...fieldStatus("trainingDays")}>
          <Space orientation="vertical" style={{ width: "100%" }}>
            <Switch
              checked={values.useSpecificDays}
              onChange={(checked) => set({ useSpecificDays: checked })}
              checkedChildren="Belirli günler"
              unCheckedChildren="Algoritma seçsin"
            />
            {values.useSpecificDays && (
              <Checkbox.Group
                value={values.trainingDays}
                onChange={(days) => set({ trainingDays: sortDays(days) })}
                options={DAY_CODES.map((code) => ({ value: code, label: DAY_SHORT_LABELS[code] }))}
              />
            )}
          </Space>
        </Form.Item>

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
