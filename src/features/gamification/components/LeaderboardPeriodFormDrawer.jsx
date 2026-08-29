import React, { useEffect } from "react";
import { Form, Select, DatePicker, Switch } from "antd";
import dayjs from "dayjs";
import { FormDrawer } from "../../../components/admin";

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
      title={isEdit ? "Edit Leaderboard Period" : "Create Leaderboard Period"}
      submitText={isEdit ? "Save Changes" : "Create Period"}
      submitting={submitting}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="type" label="Type" rules={[{ required: true }]}>
          <Select options={["Weekly", "Monthly", "AllTime"].map((t) => ({ value: t, label: t }))} />
        </Form.Item>
        <Form.Item name="dateRange" label="Date Range" rules={[{ required: true, message: "Start and end date are required" }]}>
          <DatePicker.RangePicker style={{ width: "100%" }} format="DD MMM YYYY" />
        </Form.Item>
        <Form.Item name="isActive" label="Active" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </FormDrawer>
  );
}
