import React from "react";
import { Descriptions, Typography, Skeleton, Tag } from "antd";
import dayjs from "dayjs";
import { DetailDrawer, StatusTag } from "../../../components/admin";

const { Paragraph } = Typography;

// Display-only labels for the underlying request type/status values (values
// used for filtering and matching stay in English — only the rendered text
// is translated here).
const TYPE_LABELS = { Workout: "Antrenman", Nutrition: "Beslenme", Insight: "İçgörü" };
const STATUS_LABELS = { Pending: "Beklemede", Processing: "İşleniyor", Completed: "Tamamlandı", Failed: "Başarısız" };

export default function RequestDetailDrawer({ open, request, loading, onClose }) {
  return (
    <DetailDrawer open={open} title={request ? `Yapay Zeka İsteği #${request.id}` : "Yapay Zeka İsteği"} onClose={onClose}>
      {loading || !request ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <>
          <Descriptions column={1} bordered size="small" style={{ marginBottom: 16 }}>
            <Descriptions.Item label="Kullanıcı">{request.userEmail}</Descriptions.Item>
            <Descriptions.Item label="Tür"><Tag>{TYPE_LABELS[request.type] ?? request.type}</Tag></Descriptions.Item>
            <Descriptions.Item label="Durum">
              <StatusTag status={request.status}>{STATUS_LABELS[request.status] ?? request.status}</StatusTag>
            </Descriptions.Item>
            <Descriptions.Item label="Model">{request.model ?? "—"}</Descriptions.Item>
            <Descriptions.Item label="Oluşturulma Tarihi">{dayjs(request.createdAt).format("DD MMM YYYY, HH:mm")}</Descriptions.Item>
            <Descriptions.Item label="Başlangıç Tarihi">
              {request.startedAt ? dayjs(request.startedAt).format("DD MMM YYYY, HH:mm") : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Tamamlanma Tarihi">
              {request.completedAt ? dayjs(request.completedAt).format("DD MMM YYYY, HH:mm") : "—"}
            </Descriptions.Item>
            {request.startedAt && request.completedAt && (
              <Descriptions.Item label="Süre">
                {Math.round((new Date(request.completedAt) - new Date(request.startedAt)) / 1000)}s
              </Descriptions.Item>
            )}
          </Descriptions>
          <Typography.Title level={5}>İstem</Typography.Title>
          <Paragraph
            style={{
              background: "rgba(16,24,40,0.03)",
              padding: 12,
              borderRadius: 8,
              fontSize: 13,
              whiteSpace: "pre-wrap",
            }}
          >
            {request.prompt}
          </Paragraph>
        </>
      )}
    </DetailDrawer>
  );
}
