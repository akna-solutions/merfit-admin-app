import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Typography, Alert } from "antd";
import { UserOutlined, LockOutlined, ThunderboltFilled } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useThemeMode } from "../../../theme/ThemeContext";

const { Title, Text } = Typography;

export default function LoginPage() {
  const { login } = useAuth();
  const { mode } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleFinish = async (values) => {
    setSubmitting(true);
    setError(null);
    try {
      await login({
        emailOrUsername: values.emailOrUsername,
        password: values.password,
        remember: values.remember,
      });
      const redirectTo = location.state?.from ?? "/admin";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(
        err.code === "FORBIDDEN"
          ? "Bu hesabın yönetim paneline erişimi yok."
          : "Geçersiz e-posta/kullanıcı adı veya şifre.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`mbfit-login-page ${mode === "dark" ? "is-dark" : ""}`}>
      <div className="mbfit-login-card">
        <div className="mbfit-login-brand">
          <span className="mbfit-sidebar-brand-mark">
            <ThunderboltFilled />
          </span>
          <span className="mbfit-login-brand-text">MB FIT</span>
        </div>
        <Title level={3} className="mbfit-login-title">
          Yönetim Paneli
        </Title>
        <Text type="secondary" className="mbfit-login-subtitle">
          MB Fit platformunu yönetmek için giriş yapın.
        </Text>

        {error && (
          <Alert
            type="error"
            message={error}
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginTop: 20, marginBottom: 4 }}
          />
        )}

        <Form
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ remember: true }}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            name="emailOrUsername"
            label="E-posta veya Kullanıcı Adı"
            rules={[{ required: true, message: "E-posta veya kullanıcı adı zorunludur" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="admin@mbfit.com" autoFocus />
          </Form.Item>
          <Form.Item
            name="password"
            label="Şifre"
            rules={[{ required: true, message: "Şifre zorunludur" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
          </Form.Item>
          <div className="mbfit-login-row">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Beni hatırla</Checkbox>
            </Form.Item>
          </div>
          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            loading={submitting}
            style={{ marginTop: 8 }}
          >
            Giriş Yap
          </Button>
        </Form>
      </div>
    </div>
  );
}
