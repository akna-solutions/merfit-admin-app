import React from "react";
import { Empty, Button } from "antd";

// Consistent "no records" treatment (spec §28).
export default function EmptyState({
  description = "Henüz kayıt bulunamadı.",
  actionLabel,
  onAction,
}) {
  return (
    <Empty
      className="mbfit-empty-state"
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={description}
    >
      {actionLabel && (
        <Button type="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Empty>
  );
}
