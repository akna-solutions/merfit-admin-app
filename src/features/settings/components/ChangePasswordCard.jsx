import React, { useState } from "react";
import { App, Alert, Button, Form, Input } from "antd";
import SectionCard from "../../../components/admin/SectionCard";
import { authService } from "../../auth/services/authService";

export const MIN_PASSWORD_LENGTH = 8;

/**
 * Giriş yapmış adminin kendi şifresini değiştirmesi (POST /api/admin/auth/change-password).
 * API mevcut şifreyi doğrular ve başarılı olursa diğer oturumların refresh token'larını iptal eder;
 * bu sekmedeki oturum açık kalır.
 */
export default function ChangePasswordCard() {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleFinish = async (values) => {
    setSubmitting(true);
    setError(null);
    try {
      await authService.changePassword(values);
      form.resetFields();
      message.success("Şifreniz değiştirildi.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SectionCard title="Şifre Değiştir">
      <Form form={form} layout="vertical" style={{ maxWidth: 480 }} onFinish={handleFinish} requiredMark={false}>
        {error && <Alert type="error" showIcon style={{ marginBottom: 16 }} message={error} />}
        <Form.Item
          name="currentPassword"
          label="Mevcut şifre"
          rules={[{ required: true, message: "Mevcut şifrenizi girin" }]}
        >
          <Input.Password autoComplete="current-password" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="Yeni şifre"
          dependencies={["currentPassword"]}
          rules={[
            { required: true, message: "Yeni şifreyi girin" },
            { min: MIN_PASSWORD_LENGTH, message: `En az ${MIN_PASSWORD_LENGTH} karakter olmalı` },
            { max: 100, message: "En fazla 100 karakter olabilir" },
            ({ getFieldValue }) => ({
              validator: (_, value) =>
                value && value === getFieldValue("currentPassword")
                  ? Promise.reject(new Error("Yeni şifre mevcut şifreden farklı olmalı"))
                  : Promise.resolve(),
            }),
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          name="confirmNewPassword"
          label="Yeni şifre (tekrar)"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Yeni şifreyi tekrar girin" },
            ({ getFieldValue }) => ({
              validator: (_, value) =>
                !value || value === getFieldValue("newPassword")
                  ? Promise.resolve()
                  : Promise.reject(new Error("Şifreler eşleşmiyor")),
            }),
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={submitting}>
          Şifreyi değiştir
        </Button>
      </Form>
    </SectionCard>
  );
}
