import React from "react";
import { Descriptions, Tag, Skeleton } from "antd";
import dayjs from "dayjs";
import { DetailDrawer } from "../../../components/admin";

export default function TransactionDetailDrawer({ open, transaction, loading, onClose }) {
  return (
    <DetailDrawer open={open} title="Transaction Detail" onClose={onClose}>
      {loading || !transaction ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="User">{transaction.userEmail}</Descriptions.Item>
          <Descriptions.Item label="Transaction ID">{transaction.transactionId}</Descriptions.Item>
          <Descriptions.Item label="Original Transaction ID">
            {transaction.originalTransactionId ?? "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Product">{transaction.productId}</Descriptions.Item>
          <Descriptions.Item label="Provider">{transaction.provider}</Descriptions.Item>
          <Descriptions.Item label="Amount">{transaction.amount.toFixed(2)} {transaction.currency}</Descriptions.Item>
          <Descriptions.Item label="Purchased At">{dayjs(transaction.purchasedAt).format("DD MMM YYYY, HH:mm")}</Descriptions.Item>
          <Descriptions.Item label="Expires At">
            {transaction.expiresAt ? dayjs(transaction.expiresAt).format("DD MMM YYYY") : "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Raw Receipt">
            {/* API deliberately never returns the raw receipt payload, only
                whether one exists (see AdminSubscriptionTransactionDetailDto). */}
            {transaction.hasRawReceipt ? <Tag color="blue">On File</Tag> : <Tag>Not Stored</Tag>}
          </Descriptions.Item>
        </Descriptions>
      )}
    </DetailDrawer>
  );
}
