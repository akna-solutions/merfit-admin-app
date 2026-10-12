import React, { useEffect, useState } from "react";
import { Form, Input, Select, TimePicker, Checkbox, Switch, Alert } from "antd";
import dayjs from "dayjs";
import { FormDrawer } from "../../../components/admin";
import { notificationTemplateService } from "../services/notificationService";
import { RULE_KIND_LABELS, RULE_KIND_TEMPLATE_TYPE, MEAL_TYPE_LABELS, toOptions } from "../utils/notificationLabels";
import { WEEK_DAYS, daysToMask, maskToDays } from "../utils/notificationForm";

export default function RuleFormDrawer({ open, rule, defaultTimeZone, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const [templates, setTemplates] = useState([]);
  const isEdit = Boolean(rule);
  const kind = Form.useWatch("kind", form);

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue(
      rule
        ? { ...rule, localTime: dayjs(rule.localTime, "HH:mm"), days: maskToDays(rule.daysOfWeekMask) }
        : { kind: "NutritionReminder", mealType: "Lunch", localTime: dayjs("13:30", "HH:mm"), days: maskToDays(127), onlyUsersWithPlan: true, templateIds: [] },
    );
  }, [open, rule, form]);

  useEffect(() => {
    if (!open || !kind) return;
    notificationTemplateService
      .getTemplates({ page: 1, pageSize: 100, type: RULE_KIND_TEMPLATE_TYPE[kind] })
      .then((res) => setTemplates(res.data.items))
      .catch(() => setTemplates([]));
  }, [open, kind]);

  const handleKindChange = () => form.setFieldsValue({ templateIds: [] });

  const handleSubmit = () =>
    form.validateFields().then(({ days, localTime, ...values }) =>
      onSubmit({
        ...values,
        localTime: localTime.format("HH:mm"),
        daysOfWeekMask: daysToMask(days),
        mealType: values.kind === "NutritionReminder" ? values.mealType : null,
      }),
    );

  return (
    <FormDrawer
      open={open}
      width={520}
      title={isEdit ? `"${rule?.name}" Kuralını Düzenle` : "Kural Oluştur"}
      submitText={isEdit ? "Değişiklikleri Kaydet" : "Kural Oluştur"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      {!isEdit && (
        <Alert type="info" showIcon style={{ marginBottom: 16 }} message="Yeni kural duraklatılmış olarak oluşur. Kontrol ettikten sonra listeden aktifleştirin." />
      )}
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Ad" rules={[{ required: true, max: 150 }]}>
          <Input placeholder="örn. Öğle yemeği hatırlatıcısı" />
        </Form.Item>
        <Form.Item name="description" label="Açıklama" rules={[{ max: 500 }]}>
          <Input.TextArea rows={2} />
        </Form.Item>
        <Form.Item name="kind" label="Kural türü" rules={[{ required: true }]}>
          <Select options={toOptions(RULE_KIND_LABELS)} onChange={handleKindChange} />
        </Form.Item>
        {kind === "NutritionReminder" && (
          <>
            <Form.Item name="mealType" label="Öğün" rules={[{ required: true, message: "Öğün seçin" }]}>
              <Select options={toOptions(MEAL_TYPE_LABELS)} />
            </Form.Item>
            <Form.Item
              name="onlyUsersWithPlan"
              label="Yalnızca beslenme planı olan kullanıcılar"
              valuePropName="checked"
              extra="Kapalıysa planı olmayan kullanıcılara da bu öğün kaydedilmemişse hatırlatma gider."
            >
              <Switch />
            </Form.Item>
          </>
        )}
        {kind === "WorkoutReminder" && (
          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
            message="Yalnızca planında o gün antrenman olan ve antrenmanı tamamlamamış kullanıcılara gider; dinlenme günlerinde gönderilmez."
          />
        )}
        <Form.Item
          name="localTime"
          label="Gönderim saati (kullanıcının yerel saati)"
          rules={[{ required: true }]}
          extra={`Saat dilimi bilinmeyen kullanıcılar için varsayılan: ${defaultTimeZone}. Sessiz saatler ve günlük limit ayrıca uygulanır.`}
        >
          <TimePicker format="HH:mm" minuteStep={5} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="days" label="Günler" rules={[{ required: true, type: "array", min: 1, message: "En az bir gün seçin" }]}>
          <Checkbox.Group options={WEEK_DAYS} />
        </Form.Item>
        <Form.Item
          name="templateIds"
          label="Şablonlar"
          extra="Birden fazla şablon seçilirse kullanıcıya her gün farklı biri gönderilir. Aktifleştirmek için en az bir aktif şablon gerekir."
        >
          <Select
            mode="multiple"
            placeholder="Şablon seçin"
            options={templates.map((t) => ({ value: t.id, label: `${t.name}${t.isActive ? "" : " (pasif)"}` }))}
          />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
