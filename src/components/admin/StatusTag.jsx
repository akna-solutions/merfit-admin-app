import React from "react";
import { Tag } from "antd";

// Central status -> color mapping so every table/detail screen renders
// statuses identically (spec §22). Extend this map rather than hard-coding
// colors in individual features.
const STATUS_COLOR_MAP = {
  // Generic
  active: "green",
  inactive: "default",
  suspended: "red",
  pending: "gold",
  draft: "default",
  published: "green",
  scheduled: "blue",
  expired: "red",
  // Subscriptions
  free: "default",
  plus: "gold",
  trialing: "blue",
  canceled: "red",
  cancelled: "red",
  past_due: "orange",
  // Support tickets
  open: "blue",
  in_progress: "gold",
  resolved: "green",
  closed: "default",
  // Priority
  low: "default",
  medium: "blue",
  high: "orange",
  critical: "red",
  // AI requests
  completed: "green",
  failed: "red",
  processing: "blue",
  // Boolean-ish
  yes: "green",
  no: "default",
  enabled: "green",
  disabled: "default",
};

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

export default function StatusTag({ status, colorMap, children }) {
  const key = normalize(status);
  const color = (colorMap && colorMap[key]) || STATUS_COLOR_MAP[key] || "default";
  return <Tag color={color}>{children ?? status}</Tag>;
}
