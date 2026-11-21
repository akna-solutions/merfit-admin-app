import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Descriptions, Divider, Image, Input, Popconfirm, Rate, Result, Space, Spin, Table, Tag, Timeline, Typography } from "antd";
import dayjs from "dayjs";
// Doğrudan dosyadan: admin index'i react-router'ı da yükler; bu çekmece router'a ihtiyaç duymaz (testlerde de).
import DetailDrawer from "../../../components/admin/DetailDrawer";
import StatusTag from "../../../components/admin/StatusTag";
import { useApiAction } from "../../notifications/hooks/useApiAction";
import { storeReviewService } from "../services/storeService";
import {
  REPORT_REASON_LABELS,
  REPORT_STATUS_COLORS,
  REPORT_STATUS_LABELS,
  REVIEW_HISTORY_LABELS,
  REVIEW_STATUS_COLORS,
  REVIEW_STATUS_LABELS,
} from "../utils/storeLabels";
import ReviewImage from "./ReviewImage";

const formatDateTime = (v) => (v ? dayjs(v).format("DD MMM YYYY HH:mm") : "—");

/**
 * Yorum detayı ve moderasyon işlemleri. Butonlar sunucunun döndürdüğü izinli geçişlere göre gösterilir
 * (allowedStatusTransitions); sunucu her isteği yeniden doğrular ve aynı anda başka bir yönetici işlem yaptıysa 409 döner.
 */
export default function ReviewDetailDrawer({ reviewId, onClose, onChanged }) {
  const run = useApiAction();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(null);
  const [note, setNote] = useState("");

  const load = useCallback(async () => {
    if (!reviewId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await storeReviewService.getReview(reviewId);
      setReview(response.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [reviewId]);

  useEffect(() => {
    setReview(null);
    setNote("");
    load();
  }, [load]);

  const act = async (key, fn, successMessage) => {
    setSaving(key);
    const result = await run(fn, successMessage);
    setSaving(null);
    if (result && result !== true && result.data) {
      setReview(result.data);
      setNote("");
      onChanged?.();
    } else {
      load(); // örn. 409: güncel hali göster
    }
  };

  const trimmedNote = note.trim() || null;
  const hide = () => act("hide", () => storeReviewService.updateStatus(review.id, { status: "Hidden", note: trimmedNote }), "Yorum gizlendi.");
  const publish = () =>
    act("publish", () => storeReviewService.updateStatus(review.id, { status: "Published", note: trimmedNote }), "Yorum yeniden yayınlandı.");
  const remove = () => act("delete", () => storeReviewService.deleteReview(review.id, { note: trimmedNote }), "Yorum silindi.");
  const dismiss = () => act("dismiss", () => storeReviewService.dismissReports(review.id, { note: trimmedNote }), "Raporlar kapatıldı.");

  let body;
  if (loading && !review) {
    body = (
      <div style={{ textAlign: "center", padding: 48 }}>
        <Spin />
      </div>
    );
  } else if (error && !review) {
    body = (
      <Result
        status="warning"
        title="Yorum yüklenemedi"
        subTitle={error}
        extra={
          <Button type="primary" onClick={load}>
            Tekrar dene
          </Button>
        }
      />
    );
  } else if (review) {
    const allowed = review.allowedStatusTransitions ?? [];
    body = (
      <>
        <Descriptions size="small" column={1} bordered>
          <Descriptions.Item label="Ürün">
            {review.productName} <Typography.Text type="secondary">(#{review.productId})</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Kullanıcı">
            {review.userName ? `${review.userName} · ` : ""}
            {review.userEmail ?? "—"} <Typography.Text type="secondary">(#{review.userId})</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Durum">
            <Space wrap>
              <StatusTag status={review.status} colorMap={REVIEW_STATUS_COLORS}>
                {REVIEW_STATUS_LABELS[review.status] ?? review.status}
              </StatusTag>
              {review.isVerifiedPurchase && (
                // İkon paketi test ortamında ESM sorunu çıkardığı için (bkz. OrderDetailDrawer) düz etiket.
                <Tag color="blue">✓ Onaylı alışveriş</Tag>
              )}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Puan">
            <Rate disabled value={review.rating} style={{ fontSize: 14 }} /> <span aria-label="puan">{review.rating}/5</span>
          </Descriptions.Item>
          <Descriptions.Item label="Tarih">
            {formatDateTime(review.createdAt)}
            {review.editedAt ? ` · düzenlendi ${formatDateTime(review.editedAt)}` : ""}
          </Descriptions.Item>
          <Descriptions.Item label="Faydalı oy">
            {review.helpfulCount} faydalı · {review.notHelpfulCount} faydalı değil
          </Descriptions.Item>
          {review.moderationNote && <Descriptions.Item label="Moderasyon notu">{review.moderationNote}</Descriptions.Item>}
        </Descriptions>

        <Divider titlePlacement="start">Yorum</Divider>
        {review.title && <Typography.Title level={5}>{review.title}</Typography.Title>}
        {/* Düz metin: React içeriği kaçışlar, HTML yorumlanmaz. */}
        <Typography.Paragraph style={{ whiteSpace: "pre-wrap" }} data-testid="review-comment">
          {review.comment}
        </Typography.Paragraph>
        {review.images?.length > 0 && (
          <Image.PreviewGroup>
            <Space wrap size={8}>
              {review.images.map((image) => (
                <ReviewImage key={image.id} reviewId={review.id} image={image} />
              ))}
            </Space>
          </Image.PreviewGroup>
        )}

        <Divider titlePlacement="start">Moderasyon</Divider>
        {allowed.length === 0 ? (
          <Typography.Text type="secondary">Silinmiş yorumda işlem yapılamaz.</Typography.Text>
        ) : (
          <>
            <Input.TextArea
              rows={2}
              maxLength={500}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="İşlem notu (kullanıcıya gösterilmez), örn. hakaret içeriyor"
              aria-label="İşlem notu"
            />
            <Space wrap style={{ marginTop: 12 }}>
              {allowed.includes("Hidden") && (
                <Button loading={saving === "hide"} onClick={hide}>
                  Gizle
                </Button>
              )}
              {allowed.includes("Published") && (
                <Button type="primary" loading={saving === "publish"} onClick={publish}>
                  Yeniden yayınla
                </Button>
              )}
              {review.openReportCount > 0 && review.status === "Published" && (
                <Button loading={saving === "dismiss"} onClick={dismiss}>
                  Raporları kapat
                </Button>
              )}
              {allowed.includes("Deleted") && (
                <Popconfirm
                  title="Yorum silinsin mi?"
                  description="Silinen yorum geri alınamaz; kayıt ve geçmiş saklanır."
                  okText="Sil"
                  cancelText="Vazgeç"
                  okButtonProps={{ danger: true }}
                  onConfirm={remove}
                >
                  <Button danger loading={saving === "delete"}>
                    Sil
                  </Button>
                </Popconfirm>
              )}
            </Space>
            {review.status === "Hidden" && (
              <Alert type="info" showIcon style={{ marginTop: 12 }} message="Gizlenen yorum ürün sayfasında ve puan ortalamasında görünmez." />
            )}
          </>
        )}

        <Divider titlePlacement="start">Raporlar ({review.reports?.length ?? 0})</Divider>
        {review.reports?.length ? (
          <Table
            size="small"
            rowKey="id"
            pagination={false}
            dataSource={review.reports}
            scroll={{ x: 520 }}
            columns={[
              {
                title: "Sebep",
                key: "reason",
                render: (_, r) => (
                  <div>
                    <div>{REPORT_REASON_LABELS[r.reason] ?? r.reason}</div>
                    {r.description && (
                      <Typography.Text type="secondary" style={{ fontSize: 12, whiteSpace: "pre-wrap" }}>
                        {r.description}
                      </Typography.Text>
                    )}
                  </div>
                ),
              },
              { title: "Raporlayan", key: "reporter", width: 180, render: (_, r) => r.reporterEmail ?? `#${r.reporterUserId}` },
              {
                title: "Durum",
                dataIndex: "status",
                width: 100,
                render: (v) => (
                  <StatusTag status={v} colorMap={REPORT_STATUS_COLORS}>
                    {REPORT_STATUS_LABELS[v] ?? v}
                  </StatusTag>
                ),
              },
              { title: "Tarih", dataIndex: "createdAt", width: 130, render: formatDateTime },
            ]}
          />
        ) : (
          <Typography.Text type="secondary">Bu yorum raporlanmadı.</Typography.Text>
        )}

        <Divider titlePlacement="start">İşlem geçmişi</Divider>
        <Timeline
          items={(review.history ?? []).map((h, index) => ({
            key: `${h.createdAt}-${h.action}-${index}`,
            content: (
              <div>
                <div>{REVIEW_HISTORY_LABELS[h.action] ?? h.action}</div>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {formatDateTime(h.createdAt)}
                  {h.adminUserId ? ` · ${h.adminEmail ?? `Yönetici #${h.adminUserId}`}` : " · Kullanıcı"}
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
    <DetailDrawer open={Boolean(reviewId)} width={640} title={review ? `Yorum #${review.id}` : "Yorum"} onClose={onClose}>
      {body}
    </DetailDrawer>
  );
}
