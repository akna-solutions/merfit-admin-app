import React from "react";
import { Drawer, Button, Space, Divider } from "antd";

// Standard create/edit Drawer chrome (spec §24): title, close, and a
// sticky footer with Cancel / Submit so every form drawer in the app
// behaves and looks the same regardless of feature.
export default function FormDrawer({
  open,
  title,
  width = 480,
  onClose,
  onSubmit,
  submitText = "Kaydet",
  submitting,
  children,
  extra,
}) {
  return (
    <Drawer
      title={title}
      open={open}
      onClose={onClose}
      width={width}
      destroyOnHidden
      extra={extra}
      footer={
        <div className="mbfit-drawer-footer">
          <Space>
            <Button onClick={onClose}>Vazgeç</Button>
            <Button type="primary" loading={submitting} onClick={onSubmit}>
              {submitText}
            </Button>
          </Space>
        </div>
      }
    >
      {children}
      <Divider style={{ display: "none" }} />
    </Drawer>
  );
}
