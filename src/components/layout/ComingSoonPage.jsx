import React from "react";
import { Empty, Typography } from "antd";

const { Title } = Typography;

// Placeholder so route architecture (section 20/7 of spec) resolves to
// *something* for not-yet-built screens, without designing their real UI.
export default function ComingSoonPage({ title }) {
  return (
    <div style={{ padding: "48px 0", textAlign: "center" }}>
      <Empty
        description={
          <>
            <Title level={4} style={{ marginBottom: 4 }}>
              {title}
            </Title>
            <Typography.Text type="secondary">
              This screen hasn&apos;t been built yet.
            </Typography.Text>
          </>
        }
      />
    </div>
  );
}
