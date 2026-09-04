import React from "react";
import { Descriptions, Tag, Skeleton } from "antd";
import dayjs from "dayjs";
import { DetailDrawer } from "../../../components/admin";

export default function TransactionDetailDrawer({ open, transaction, loading, onClose }) {
  return (
    <DetailDrawer open={open} title="İşlem Detayı" onClose={onClose}>
      {loading || !transaction ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Kullanıcı">{transaction.userEmail}</Descriptions.Item>
          <Descriptions.Item label="İşlem Kimliği">{transaction.transactionId}</Descriptions.Item>
          <Descriptions.Item label="Orijinal İşlem Kimliği">
            {transaction.originalTransactionId ?? "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Ürün">{transaction.productId}</Descriptions.Item>
          <Descriptions.Item label="Sağlayıcı">{transaction.provider}</Descriptions.Item>
          <Descriptions.Item label="Tutar">{transaction.amount.toFixed(2)} {transaction.currency}</Descriptions.Item>
          <Descriptions.Item label="Satın Alma Tarihi">{dayjs(transaction.purchasedAt).format("DD MMM YYYY, HH:mm")}</Descriptions.Item>
          <Descriptions.Item label="Bitiş Tarihi">
            {transaction.expiresAt ? dayjs(transaction.expiresAt).format("DD MMM YYYY") : "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Ham Makbuz">
            {/* API deliberately never returns the raw receipt payload, only
                whether one exists (see AdminSubscriptionTransactionDetailDto). */}
            {transaction.hasRawReceipt ? <Tag color="blue">Kayıtlı</Tag> : <Tag>Saklanmıyor</Tag>}
          </Descriptions.Item>
        </Descriptions>
      )}
    </DetailDrawer>
  );
}
