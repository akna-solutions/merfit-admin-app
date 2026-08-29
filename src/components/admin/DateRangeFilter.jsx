import React from "react";
import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

// Thin wrapper so every filter bar's date range control shares the same
// format / clear behavior (spec §23).
export default function DateRangeFilter({ value, onChange, ...rest }) {
  return (
    <RangePicker
      style={{ width: "100%" }}
      value={value}
      onChange={onChange}
      format="DD MMM YYYY"
      allowClear
      {...rest}
    />
  );
}
