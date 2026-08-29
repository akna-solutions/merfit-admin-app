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
          ? "This account doesn't have admin panel access."
          : "Invalid email/username or password.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`merfit-login-page ${mode === "dark" ? "is-dark" : ""}`}>
      <div className="merfit-login-card">
        <div className="merfit-login-brand">
          <span className="merfit-sidebar-brand-mark">
            <ThunderboltFilled />
          </span>
          <span className="merfit-login-brand-text">MERFIT</span>
        </div>
        <Title level={3} className="merfit-login-title">
          Admin Panel
        </Title>
        <Text type="secondary" className="merfit-login-subtitle">
          Sign in to manage the Merfit platform.
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
            label="Email or Username"
            rules={[{ required: true, message: "Email or username is required" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="admin@merfit.com" autoFocus />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Password is required" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
          </Form.Item>
          <div className="merfit-login-row">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
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
            Sign In
          </Button>
        </Form>

        <Text type="secondary" className="merfit-login-hint">
          Demo credentials — admin@merfit.com / admin123
        </Text>
      </div>
    </div>
  );
}
