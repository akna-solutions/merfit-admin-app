import React, { useEffect, useState } from "react";
import { Modal, Radio, DatePicker, Checkbox, Alert, Space, Typography } from "antd";
import dayjs from "dayjs";
import { notificationCampaignService } from "../services/notificationService";
import AudienceSummary from "./AudienceSummary";

const { Text } = Typography;

/**
 * Taslak kampanyayi hemen gonderir veya ileri bir zamana zamanlar. Kitle, esigi asiyorsa acik onay
 * kutusu isaretlenmeden gonderim butonu etkinlesmez (API de confirmLargeAudience olmadan reddeder).
 */
export default function ScheduleCampaignModal({ open, campaign, onClose, onDone, run }) {
  const [mode, setMode] = useState("now");
  const [scheduledAt, setScheduledAt] = useState(null);
  const [audience, setAudience] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !campaign) return;
    setMode("now");
    setScheduledAt(null);
    setConfirmed(false);
    setAudience(null);
    setLoading(true);
    notificationCampaignService
      .getAudience(campaign.id)
      .then((res) => setAudience(res.data))
      .catch(() => setAudience(null))
      .finally(() => setLoading(false));
  }, [open, campaign]);

  const needsConfirm = Boolean(audience?.requiresConfirmation);
  const empty = audience && audience.recipientCount === 0;
  const timeInvalid = mode === "later" && (!scheduledAt || !scheduledAt.isAfter(dayjs()));
  const disabled = loading || !audience || empty || timeInvalid || (needsConfirm && !confirmed);

  const handleOk = async () => {
    setSubmitting(true);
    const payload = { confirmLargeAudience: confirmed };
    const ok =
      mode === "now"
        ? await run(() => notificationCampaignService.sendNow(campaign.id, payload), "Kampanya gönderim kuyruğuna alındı.")
        : await run(
            () => notificationCampaignService.schedule(campaign.id, { ...payload, scheduledAtUtc: scheduledAt.toISOString() }),
            `Kampanya ${scheduledAt.format("DD.MM.YYYY HH:mm")} için zamanlandı.`,
          );
    setSubmitting(false);
    if (ok) onDone?.();
  };

  return (
    <Modal
      open={open}
      title={campaign ? `"${campaign.name}" gönderimi` : ""}
      okText={mode === "now" ? "Şimdi Gönder" : "Zamanla"}
      cancelText="Vazgeç"
      onCancel={onClose}
      onOk={handleOk}
      okButtonProps={{ disabled, loading: submitting, danger: needsConfirm }}
      destroyOnHidden
    >
      <Space direction="vertical" size={16} style={{ width: "100%" }}>
        <Radio.Group
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          optionType="button"
          options={[
            { value: "now", label: "Hemen gönder" },
            { value: "later", label: "İleri tarihe zamanla" },
          ]}
        />
        {mode === "later" && (
          <DatePicker
            showTime={{ format: "HH:mm" }}
            format="DD.MM.YYYY HH:mm"
            style={{ width: "100%" }}
            value={scheduledAt}
            onChange={setScheduledAt}
            disabledDate={(d) => d && d.isBefore(dayjs().startOf("day"))}
            placeholder="Gönderim zamanı (tarayıcı saatiyle)"
          />
        )}
        <AudienceSummary preview={audience} loading={loading} />
        {empty && <Alert type="error" showIcon message="Bu kitlede bildirim alabilecek kullanıcı yok." />}
        {needsConfirm && (
          <Checkbox checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} data-testid="confirm-large-audience">
            <Text strong>{audience.recipientCount} kullanıcıya gönderileceğini onaylıyorum.</Text>
          </Checkbox>
        )}
        <Text type="secondary" style={{ fontSize: 12 }}>
          Alıcılar arka planda partiler halinde kuyruğa alınır; gönderim başladıktan sonra iptal edilirse kalan bildirimler gönderilmez.
        </Text>
      </Space>
    </Modal>
  );
}
