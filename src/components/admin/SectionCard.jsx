import React from "react";
import { Card } from "antd";

// Generic content card reusing the exact chart/table card visual language
// already established on the Dashboard (merfit-table-card head/body
// padding, radius, shadow) so every new page's cards look identical to
// Dashboard's (spec §38 Design Consistency).
export default function SectionCard({
  title,
  extra,
  loading,
  bodyPadding,
  className = "",
  children,
}) {
  return (
    <Card
      title={title}
      extra={extra}
      loading={loading}
      bordered={false}
      className={`merfit-table-card ${className}`.trim()}
      styles={bodyPadding ? { body: { padding: bodyPadding } } : undefined}
    >
      {children}
    </Card>
  );
}
