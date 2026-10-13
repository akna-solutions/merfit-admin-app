import React from "react";
import { Avatar } from "antd";

// Recurring table-cell pattern across nearly every feature table: an
// avatar/icon on the left, a bold title and a muted subtitle stacked on
// the right (Users' Name+Username, Workouts' Title+Category, Content's
// Title+Key, etc.) — centralized so it renders identically everywhere.
// `avatar` kayıt görselinin URL'sidir; görsel yüklenemezse Avatar baş harfe
// geri döner, kırık görsel simgesi hiç görünmez.
export default function EntityCell({ avatar, avatarColor, avatarShape = "circle", title, subtitle, icon }) {
  return (
    <div className="mbfit-entity-cell">
      <Avatar
        size={36}
        shape={avatarShape}
        src={avatar}
        alt={avatar ? title : undefined}
        style={!avatar ? { backgroundColor: avatarColor || "#2F6FED" } : undefined}
        icon={!avatar && !title ? icon : undefined}
      >
        {title ? title.charAt(0).toUpperCase() : null}
      </Avatar>
      <div className="mbfit-entity-cell-text">
        <span className="mbfit-entity-cell-title">{title}</span>
        {subtitle && <span className="mbfit-entity-cell-sub">{subtitle}</span>}
      </div>
    </div>
  );
}
