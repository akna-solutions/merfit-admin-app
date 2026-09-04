import React, { useEffect } from "react";
import { Form, Select, DatePicker, Switch } from "antd";
import dayjs from "dayjs";
import { FormDrawer } from "../../../components/admin";
import { LEADERBOARD_PERIOD_TYPE_LABELS } from "../services/gamificationService";

export default function LeaderboardPeriodFormDrawer({ open, period, submitting, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const isEdit = Boolean(period);

  useEffect(() => {
    if (open) {
      form.setFieldsValue(
        period
          ? { ...period, dateRange: [dayjs(period.startDate), dayjs(period.endDate)] }
          : { type: "Weekly", isActive: true },
      );
    }
  }, [open, period, form]);

  const handleSubmit = () => {
    form.validateFields().then(({ dateRange, ...rest }) => {
      onSubmit({
        ...rest,
        startDate: dateRange[0].toISOString(),
        endDate: dateRange[1].toISOString(),
      });
    });
  };

  return (
    <FormDrawer
      open={open}
      title={isEdit ? "Liderlik Tablosu Dönemini Düzenle" : "Liderlik Tablosu Dönemi Oluştur"}
      submitText={isEdit ? "Değişiklikleri Kaydet" : "Dönem Oluştur"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="type" label="Tür" rules={[{ required: true }]}>
          <Select options={["Weekly", "Monthly", "AllTime"].map((t) => ({ value: t, label: LEADERBOARD_PERIOD_TYPE_LABELS[t] }))} />
        </Form.Item>
        <Form.Item name="dateRange" label="Tarih Aralığı" rules={[{ required: true, message: "Başlangıç ve bitiş tarihi zorunludur" }]}>
          <DatePicker.RangePicker style={{ width: "100%" }} format="DD MMM YYYY" />
        </Form.Item>
        <Form.Item name="isActive" label="Aktif" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
