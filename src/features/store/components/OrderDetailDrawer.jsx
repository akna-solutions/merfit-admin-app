import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Descriptions, Divider, Form, Input, Result, Select, Space, Spin, Table, Timeline, Typography } from "antd";
import dayjs from "dayjs";
// Doğrudan dosyadan: admin index'i react-router'ı da yükler; bu çekmece router'a ihtiyaç duymaz (testlerde de).
import DetailDrawer from "../../../components/admin/DetailDrawer";
import StatusTag from "../../../components/admin/StatusTag";
import { useApiAction } from "../../notifications/hooks/useApiAction";
import { storeOrderService } from "../services/storeService";
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
  describeActor,
  formatMoney,
} from "../utils/storeLabels";

const formatDateTime = (v) => (v ? dayjs(v).format("DD MMM YYYY HH:mm") : "—");

/**
 * Sipariş detayı ve durum işlemleri. Seçilebilen durumlar sunucunun döndürdüğü izinli geçişlerdir
 * (allowedStatusTransitions / allowedPaymentTransitions); sunucu her isteği yeniden doğrular.
 */
export default function OrderDetailDrawer({ orderId, onClose, onChanged }) {
  const run = useApiAction();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(null);
  const [statusForm] = Form.useForm();
  const [paymentForm] = Form.useForm();

  const load = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await storeOrderService.getOrder(orderId);
      setOrder(response.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    setOrder(null);
    statusForm.resetFields();
    paymentForm.resetFields();
    load();
  }, [load, statusForm, paymentForm]);

  const applyResult = (result) => {
    if (result && result !== true && result.data) {
      setOrder(result.data);
      onChanged?.();
      return true;
    }
    // Hata (örn. 409: durum başka bir yönetici tarafından değişti): güncel hali yeniden yükle.
    load();
    return false;
  };

  const submitStatus = async () => {
    const values = await statusForm.validateFields();
    setSaving("status");
    const result = await run(
      () => storeOrderService.updateStatus(order.id, { status: values.status, note: values.note?.trim() || null }),
      `Sipariş durumu "${ORDER_STATUS_LABELS[values.status] ?? values.status}" olarak güncellendi.`,
    );
    setSaving(null);
    if (applyResult(result)) statusForm.resetFields();
  };

  const submitPayment = async () => {
    const values = await paymentForm.validateFields();
    setSaving("payment");
    const result = await run(
      () =>
        storeOrderService.updatePaymentStatus(order.id, {
          paymentStatus: values.paymentStatus,
          paymentReference: values.paymentReference?.trim() || null,
          note: values.note?.trim() || null,
        }),
      `Ödeme durumu "${PAYMENT_STATUS_LABELS[values.paymentStatus] ?? values.paymentStatus}" olarak güncellendi.`,
    );
    setSaving(null);
    if (applyResult(result)) paymentForm.resetFields();
  };

  const nextStatus = Form.useWatch("status", statusForm);

  let body;
  if (loading && !order) {
    body = (
      <div style={{ textAlign: "center", padding: 48 }}>
        <Spin />
      </div>
    );
  } else if (error && !order) {
    body = (
      <Result
        status="warning"
        title="Sipariş yüklenemedi"
        subTitle={error}
        extra={
          <Button type="primary" onClick={load}>
            Tekrar dene
          </Button>
        }
      />
    );
  } else if (order) {
    const a = order.shippingAddress;
    body = (
      <>
        <Descriptions size="small" column={1} bordered>
          <Descriptions.Item label="Sipariş no">
            <Typography.Text copyable>{order.orderNumber}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Tarih">{formatDateTime(order.createdAt)}</Descriptions.Item>
          <Descriptions.Item label="Müşteri">
            {order.userEmail ?? "—"} <Typography.Text type="secondary">(#{order.userId})</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Sipariş durumu">
            <StatusTag status={order.status} colorMap={ORDER_STATUS_COLORS}>
              {ORDER_STATUS_LABELS[order.status] ?? order.status}
            </StatusTag>
          </Descriptions.Item>
          <Descriptions.Item label="Ödeme">
            <Space wrap>
              {PAYMENT_METHOD_LABELS[order.paymentMethod] ?? order.paymentMethod}
              <StatusTag status={order.paymentStatus} colorMap={PAYMENT_STATUS_COLORS}>
                {PAYMENT_STATUS_LABELS[order.paymentStatus] ?? order.paymentStatus}
              </StatusTag>
              {order.paymentReference && <Typography.Text type="secondary">Ref: {order.paymentReference}</Typography.Text>}
              {order.paidAt && <Typography.Text type="secondary">· {formatDateTime(order.paidAt)}</Typography.Text>}
            </Space>
          </Descriptions.Item>
          {order.cancelledAt && (
            <Descriptions.Item label="İptal">
              {formatDateTime(order.cancelledAt)}
              {order.cancelReason ? ` · ${order.cancelReason}` : ""}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Teslimat adresi">
            <div>
              {a.title} · {a.recipientName} · {a.phoneNumber}
            </div>
            <div>{a.addressLine}</div>
            <div>
              {a.district} / {a.city}
              {a.postalCode ? ` · ${a.postalCode}` : ""}
            </div>
          </Descriptions.Item>
        </Descriptions>

        <Divider titlePlacement="start">Ürünler</Divider>
        <Table
          size="small"
          rowKey="id"
          pagination={false}
          dataSource={order.items}
          scroll={{ x: 560 }}
          columns={[
            {
              title: "Ürün",
              key: "name",
              render: (_, i) => (
                <div>
                  <div>{i.productName}</div>
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {i.sku}
                    {i.variantLabel ? ` · ${i.variantLabel}` : ""}
                  </Typography.Text>
                </div>
              ),
            },
            { title: "Adet", dataIndex: "quantity", width: 60 },
            { title: "Birim", dataIndex: "unitPrice", width: 110, render: formatMoney },
            { title: "Tutar", dataIndex: "lineTotal", width: 120, render: formatMoney },
          ]}
        />
        <Descriptions size="small" column={1} style={{ marginTop: 12 }}>
          <Descriptions.Item label="Ara toplam (liste)">{formatMoney(order.subtotal)}</Descriptions.Item>
          <Descriptions.Item label="İndirim">−{formatMoney(order.discountAmount)}</Descriptions.Item>
          <Descriptions.Item label="Kargo">{order.shippingCost > 0 ? formatMoney(order.shippingCost) : "Ücretsiz"}</Descriptions.Item>
          <Descriptions.Item label="Genel toplam">
            <strong>{formatMoney(order.totalAmount)}</strong>
          </Descriptions.Item>
        </Descriptions>

        <Divider titlePlacement="start">Sipariş durumu</Divider>
        <Typography.Paragraph type="secondary" style={{ fontSize: 12, marginTop: -4 }}>
          Sipariş veya ödeme durumu değiştiğinde müşteriye MB Shop bildirim kutusuna ve telefonuna otomatik bildirim gider (MB FIT bildirimlerinden ayrı).
        </Typography.Paragraph>
        {order.allowedStatusTransitions.length === 0 ? (
          <Typography.Text type="secondary">Bu sipariş için başka durum geçişi yok.</Typography.Text>
        ) : (
          <Form form={statusForm} layout="vertical">
            <Form.Item name="status" label="Yeni durum" rules={[{ required: true, message: "Durum seçin" }]}>
              <Select
                placeholder="Durum seçin"
                options={order.allowedStatusTransitions.map((s) => ({ value: s, label: ORDER_STATUS_LABELS[s] ?? s }))}
              />
            </Form.Item>
            {nextStatus === "Cancelled" && (
              <Alert
                type="warning"
                showIcon
                style={{ marginBottom: 12 }}
                message="İptal edilen siparişin ürünleri stoğa geri eklenir. Ödemesi alınmış siparişte ödeme durumu “İade bekleniyor” olur."
              />
            )}
            <Form.Item name="note" label="Not" rules={[{ max: 300 }]}>
              <Input.TextArea rows={2} maxLength={300} placeholder="örn. Kargo takip no" />
            </Form.Item>
            <Button type="primary" danger={nextStatus === "Cancelled"} loading={saving === "status"} onClick={submitStatus}>
              Durumu güncelle
            </Button>
          </Form>
        )}

        <Divider titlePlacement="start">Ödeme durumu</Divider>
        {order.allowedPaymentTransitions.length === 0 ? (
          <Typography.Text type="secondary">Bu sipariş için başka ödeme durumu geçişi yok.</Typography.Text>
        ) : (
          <Form form={paymentForm} layout="vertical">
            <Form.Item name="paymentStatus" label="Yeni ödeme durumu" rules={[{ required: true, message: "Ödeme durumu seçin" }]}>
              <Select
                placeholder="Ödeme durumu seçin"
                options={order.allowedPaymentTransitions.map((s) => ({ value: s, label: PAYMENT_STATUS_LABELS[s] ?? s }))}
              />
            </Form.Item>
            <Form.Item name="paymentReference" label="Ödeme referansı" extra="Havale dekont no, POS onay kodu vb." rules={[{ max: 120 }]}>
              <Input maxLength={120} />
            </Form.Item>
            <Form.Item name="note" label="Not" rules={[{ max: 300 }]}>
              <Input.TextArea rows={2} maxLength={300} />
            </Form.Item>
            <Button type="primary" loading={saving === "payment"} onClick={submitPayment}>
              Ödeme durumunu güncelle
            </Button>
          </Form>
        )}

        <Divider titlePlacement="start">Geçmiş</Divider>
        <Timeline
          items={order.history.map((h) => ({
            key: `${h.createdAt}-${h.status}-${h.paymentStatus}`,
            content: (
              <div>
                <div>
                  {ORDER_STATUS_LABELS[h.status] ?? h.status} · {PAYMENT_STATUS_LABELS[h.paymentStatus] ?? h.paymentStatus}
                </div>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {formatDateTime(h.createdAt)} · {describeActor(h.changedBy)}
                  {h.note ? ` · ${h.note}` : ""}
                </Typography.Text>
              </div>
            ),
          }))}
        />
      </>
    );
  }

  return (
    <DetailDrawer open={Boolean(orderId)} width={640} title={order ? `Sipariş ${order.orderNumber}` : "Sipariş"} onClose={onClose}>
      {body}
    </DetailDrawer>
  );
}
