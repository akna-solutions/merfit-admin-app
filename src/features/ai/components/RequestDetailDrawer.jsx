import React from "react";
import { Descriptions, Typography, Skeleton, Tag } from "antd";
import dayjs from "dayjs";
import { DetailDrawer, StatusTag } from "../../../components/admin";

const { Paragraph } = Typography;

export default function RequestDetailDrawer({ open, request, loading, onClose }) {
  return (
    <DetailDrawer open={open} title={request ? `AI Request #${request.id}` : "AI Request"} onClose={onClose}>
      {loading || !request ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <>
          <Descriptions column={1} bordered size="small" style={{ marginBottom: 16 }}>
            <Descriptions.Item label="User">{request.userEmail}</Descriptions.Item>
            <Descriptions.Item label="Type"><Tag>{request.type}</Tag></Descriptions.Item>
            <Descriptions.Item label="Status"><StatusTag status={request.status} /></Descriptions.Item>
            <Descriptions.Item label="Model">{request.model ?? "—"}</Descriptions.Item>
            <Descriptions.Item label="Created At">{dayjs(request.createdAt).format("DD MMM YYYY, HH:mm")}</Descriptions.Item>
            <Descriptions.Item label="Started At">
              {request.startedAt ? dayjs(request.startedAt).format("DD MMM YYYY, HH:mm") : "—"}
            </Descriptions.Item>
            <Descriptions.Item label="Completed At">
              {request.completedAt ? dayjs(request.completedAt).format("DD MMM YYYY, HH:mm") : "—"}
            </Descriptions.Item>
            {request.startedAt && request.completedAt && (
              <Descriptions.Item label="Duration">
                {Math.round((new Date(request.completedAt) - new Date(request.startedAt)) / 1000)}s
              </Descriptions.Item>
            )}
          </Descriptions>
          <Typography.Title level={5}>Prompt</Typography.Title>
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
