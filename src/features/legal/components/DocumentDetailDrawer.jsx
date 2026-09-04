import React from "react";
import { Descriptions, Tag, Spin, Typography } from "antd";
import dayjs from "dayjs";
import { DetailDrawer, StatusTag } from "../../../components/admin";
import { LEGAL_DOCUMENT_TYPE_LABELS } from "../services/legalService";

const { Paragraph, Text } = Typography;

export default function DocumentDetailDrawer({ open, document, loading, onClose }) {
  return (
    <DetailDrawer open={open} title={document ? document.title : "Belge Detayları"} width={640} onClose={onClose}>
      {loading || !document ? (
        <Spin />
      ) : (
        <>
          <Descriptions column={1} bordered size="small" style={{ marginBottom: 24 }}>
            <Descriptions.Item label="Tür">
              <Tag color={document.type === "PrivacyPolicy" ? "blue" : "purple"}>{LEGAL_DOCUMENT_TYPE_LABELS[document.type] ?? document.type}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Sürüm">{document.version}</Descriptions.Item>
            <Descriptions.Item label="Dil">{document.language}</Descriptions.Item>
            <Descriptions.Item label="Yayınlanma Tarihi">
              {document.publishedAt ? dayjs(document.publishedAt).format("DD MMM YYYY HH:mm") : <Text type="secondary">—</Text>}
            </Descriptions.Item>
            <Descriptions.Item label="Durum">
              <StatusTag status={document.isActive ? "Active" : "Inactive"}>{document.isActive ? "Aktif" : "Pasif"}</StatusTag>
            </Descriptions.Item>
            <Descriptions.Item label="Güncellenme Tarihi">
              {document.updatedAt ? dayjs(document.updatedAt).format("DD MMM YYYY HH:mm") : <Text type="secondary">—</Text>}
            </Descriptions.Item>
          </Descriptions>

          <Text strong>İçerik</Text>
          <Paragraph style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{document.content}</Paragraph>
        </>
      )}
    </DetailDrawer>
  );
}
