import React from "react";
import { Descriptions, Tag, Spin, Typography } from "antd";
import dayjs from "dayjs";
import { DetailDrawer, StatusTag } from "../../../components/admin";

const { Paragraph, Text } = Typography;

export default function DocumentDetailDrawer({ open, document, loading, onClose }) {
  return (
    <DetailDrawer open={open} title={document ? document.title : "Document Details"} width={640} onClose={onClose}>
      {loading || !document ? (
        <Spin />
      ) : (
        <>
          <Descriptions column={1} bordered size="small" style={{ marginBottom: 24 }}>
            <Descriptions.Item label="Type">
              <Tag color={document.type === "PrivacyPolicy" ? "blue" : "purple"}>{document.type}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Version">{document.version}</Descriptions.Item>
            <Descriptions.Item label="Language">{document.language}</Descriptions.Item>
            <Descriptions.Item label="Published At">
              {document.publishedAt ? dayjs(document.publishedAt).format("DD MMM YYYY HH:mm") : <Text type="secondary">—</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <StatusTag status={document.isActive ? "Active" : "Inactive"} />
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {document.updatedAt ? dayjs(document.updatedAt).format("DD MMM YYYY HH:mm") : <Text type="secondary">—</Text>}
            </Descriptions.Item>
          </Descriptions>

          <Text strong>Content</Text>
          <Paragraph style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{document.content}</Paragraph>
        </>
      )}
    </DetailDrawer>
  );
}
