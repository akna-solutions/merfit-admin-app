import React from "react";
import { Avatar } from "antd";

// Recurring table-cell pattern across nearly every feature table: an
// avatar/icon on the left, a bold title and a muted subtitle stacked on
// the right (Users' Name+Username, Workouts' Title+Category, Content's
// Title+Key, etc.) — centralized so it renders identically everywhere.
export default function EntityCell({ avatar, avatarColor, title, subtitle, icon }) {
  return (
    <div className="mbfit-entity-cell">
      <Avatar
        size={36}
        src={avatar}
        style={!avatar ? { backgroundColor: avatarColor || "#2F6FED" } : undefined}
        icon={!avatar && !title ? icon : undefined}
      >
        {!avatar && title ? title.charAt(0).toUpperCase() : null}
      </Avatar>
      <div className="mbfit-entity-cell-text">
        <span className="mbfit-entity-cell-title">{title}</span>
        {subtitle && <span className="mbfit-entity-cell-sub">{subtitle}</span>}
      </div>
    </div>
  );
}
