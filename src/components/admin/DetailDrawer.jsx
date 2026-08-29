import React from "react";
import { Drawer } from "antd";

// Standard read-only detail Drawer chrome (spec §5, §13, §19) — used for
// User Detail, Ticket Detail, Audit Log Detail, etc.
export default function DetailDrawer({
  open,
  title,
  width = 560,
  onClose,
  extra,
  children,
}) {
  return (
    <Drawer
      title={title}
      open={open}
      onClose={onClose}
      width={width}
      destroyOnHidden
      extra={extra}
    >
      {children}
    </Drawer>
  );
}
