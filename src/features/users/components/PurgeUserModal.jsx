import React, { useEffect, useState } from "react";
import { Alert, Form, Input, Modal, Typography } from "antd";

const { Paragraph, Text } = Typography;

export function emailMatches(typed, email) {
  return Boolean(email) && (typed ?? "").trim().toLowerCase() === email.trim().toLowerCase();
}

/**
 * Kalıcı silme onayı (POST /api/admin/users/{id}/purge). İşlem geri alınamadığı için admin
 * kullanıcının e-posta adresini yeniden yazmadan "Kalıcı olarak sil" düğmesi etkinleşmez;
 * API de aynı eşleşmeyi ayrıca doğrular.
 */
export default function PurgeUserModal({ user, onClose, onSubmit }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const typed = Form.useWatch("confirmEmail", form);
  const canSubmit = emailMatches(typed, user?.email);

  useEffect(() => {
    if (user) {
      form.resetFields();
      setError(null);
    }
  }, [user, form]);

  const handleOk = async () => {
    const values = await form.validateFields();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ confirmEmail: values.confirmEmail.trim(), reason: values.reason?.trim() || null });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fullName = user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email : "";

  return (
    <Modal
      open={Boolean(user)}
      title="Kullanıcıyı kalıcı olarak sil"
      okText="Kalıcı olarak sil"
      cancelText="Vazgeç"
      okButtonProps={{ danger: true, disabled: !canSubmit }}
      confirmLoading={submitting}
      onOk={handleOk}
      onCancel={onClose}
      destroyOnHidden
    >
      <Alert
        type="error"
        showIcon
        style={{ marginBottom: 16 }}
        message="Bu işlem geri alınamaz."
        description="Hesap ile birlikte antrenman, beslenme, skor, bildirim, abonelik, destek ve MB Shop sipariş kayıtları silinir. Bu e-posta adresiyle daha sonra yeniden kayıt olunabilir."
      />
      <Paragraph>
        <Text strong>{fullName}</Text> hesabını silmek için e-posta adresini (<Text code>{user?.email}</Text>) aşağıya yazın.
      </Paragraph>
      {error && <Alert type="warning" showIcon style={{ marginBottom: 16 }} message={error} />}
      <Form form={form} layout="vertical">
        <Form.Item name="confirmEmail" label="E-posta adresi" rules={[{ required: true, message: "E-posta adresini yazın" }]}>
          <Input autoComplete="off" placeholder={user?.email} />
        </Form.Item>
        <Form.Item name="reason" label="Sebep (isteğe bağlı)" rules={[{ max: 500 }]}>
          <Input.TextArea maxLength={500} rows={2} placeholder="örn. Kullanıcının hesap silme talebi" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
