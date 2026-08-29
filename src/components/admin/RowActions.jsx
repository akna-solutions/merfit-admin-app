import React from "react";
import { Button, Dropdown, Popconfirm } from "antd";
import { MoreOutlined } from "@ant-design/icons";

// Standard row-actions control (spec §22): a "..." Dropdown for a list of
// actions, with delete-type actions routed through a Popconfirm so a
// destructive click is never one accidental tap away from committing.
// items: [{ key, label, icon, danger, confirm: "Delete this item?", onClick }]
export default function RowActions({ items }) {
  const menuItems = items.map((item) => ({
    key: item.key,
    label: item.confirm ? (
      <Popconfirm
        title={item.confirm}
        okText="Yes"
        cancelText="Cancel"
        okButtonProps={{ danger: item.danger }}
        onConfirm={item.onClick}
      >
        <span onClick={(e) => e.stopPropagation()}>{item.label}</span>
      </Popconfirm>
    ) : (
      item.label
    ),
    icon: item.icon,
    danger: item.danger,
    onClick: item.confirm
      ? undefined
      : (info) => {
          info?.domEvent?.stopPropagation?.();
          item.onClick?.();
        },
  }));

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={["click"]}
      placement="bottomRight"
    >
      <Button
        type="text"
        shape="circle"
        icon={<MoreOutlined />}
        onClick={(e) => e.stopPropagation()}
        aria-label="Row actions"
      />
    </Dropdown>
  );
}
