import React from "react";
import { Descriptions, Tag, Skeleton, Row, Col, Typography, Empty } from "antd";
import dayjs from "dayjs";
import { DetailDrawer } from "../../../components/admin";

const { Text } = Typography;

function JsonBlock({ value }) {
  if (!value) return <Empty description="No data" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  return (
    <pre
      style={{
        background: "rgba(16,24,40,0.03)",
        padding: 10,
        borderRadius: 8,
        fontSize: 12,
        overflow: "auto",
        maxHeight: 260,
        margin: 0,
      }}
    >
      {value}
    </pre>
  );
}

export default function AuditLogDetailDrawer({ open, log, loading, onClose }) {
  return (
    <DetailDrawer open={open} title={log ? `Audit Log #${log.id}` : "Audit Log"} width={600} onClose={onClose}>
      {loading || !log ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <>
          <Descriptions column={1} bordered size="small" style={{ marginBottom: 16 }}>
            <Descriptions.Item label="Timestamp">{dayjs(log.createdAt).format("DD MMM YYYY, HH:mm:ss")}</Descriptions.Item>
            <Descriptions.Item label="Admin">{log.adminEmail ?? <Text type="secondary">System</Text>}</Descriptions.Item>
            <Descriptions.Item label="Action"><Tag color="blue">{log.action}</Tag></Descriptions.Item>
            <Descriptions.Item label="Entity">{log.entity} {log.entityId ? `#${log.entityId}` : ""}</Descriptions.Item>
            <Descriptions.Item label="IP Address">{log.ipAddress ?? "—"}</Descriptions.Item>
            <Descriptions.Item label="User Agent">
              <Text style={{ fontSize: 12 }} type="secondary">{log.userAgent ?? "—"}</Text>
            </Descriptions.Item>
          </Descriptions>

          <Row gutter={12}>
            <Col span={12}>
              <Text strong>Before</Text>
              <div style={{ marginTop: 6 }}><JsonBlock value={log.oldValueJson} /></div>
            </Col>
            <Col span={12}>
              <Text strong>After</Text>
              <div style={{ marginTop: 6 }}><JsonBlock value={log.newValueJson} /></div>
            </Col>
          </Row>
        </>
      )}
    </DetailDrawer>
  );
}
