import React from "react";
import { Descriptions, Skeleton, Typography } from "antd";
import dayjs from "dayjs";
import { DetailDrawer } from "../../../components/admin";

export default function ResultDetailDrawer({ open, result, loading, onClose }) {
  return (
    <DetailDrawer open={open} title={result ? `Yapay Zeka Sonucu #${result.id}` : "Yapay Zeka Sonucu"} onClose={onClose}>
      {loading || !result ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <>
          <Descriptions column={1} bordered size="small" style={{ marginBottom: 16 }}>
            <Descriptions.Item label="İstek">#{result.requestId}</Descriptions.Item>
            <Descriptions.Item label="Kullanıcı">{result.userEmail}</Descriptions.Item>
            <Descriptions.Item label="Oluşturulma Tarihi">{dayjs(result.createdAt).format("DD MMM YYYY, HH:mm")}</Descriptions.Item>
          </Descriptions>
          <Typography.Title level={5}>Sonuç JSON</Typography.Title>
          <pre
            style={{
              background: "rgba(16,24,40,0.03)",
              padding: 12,
              borderRadius: 8,
              fontSize: 12,
              overflow: "auto",
              maxHeight: 320,
            }}
          >
            {result.resultJson}
          </pre>
        </>
      )}
    </DetailDrawer>
  );
}
