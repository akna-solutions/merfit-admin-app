import React from "react";
import {
  Layout,
  DatePicker,
  Switch,
  Badge,
  Avatar,
  Dropdown,
  Typography,
  Space,
  Button,
  Tooltip,
} from "antd";
import {
  BellOutlined,
  MenuOutlined,
  SunOutlined,
  MoonOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useThemeMode } from "../../theme/ThemeContext";

const { Header } = Layout;
const { RangePicker } = DatePicker;
const { Title } = Typography;

const profileMenuItems = [
  { key: "profile", icon: <UserOutlined />, label: "Profile" },
  { key: "settings", icon: <SettingOutlined />, label: "Settings" },
  { type: "divider" },
  {
    key: "sign-out",
    icon: <LogoutOutlined />,
    label: "Sign Out",
    danger: true,
  },
];

export default function AdminHeader({
  onOpenMobileSidebar,
  onDateRangeChange,
}) {
  const { mode, toggleMode } = useThemeMode();

  // Reusable default range; wired so the RangePicker is ready to be
  // connected to real API `from`/`to` params later (see spec §12).
  const defaultRange = [dayjs().startOf("month"), dayjs()];

  return (
    <Header className="merfit-header">
      <div className="merfit-header-left">
        <Button
          type="text"
          className="merfit-header-menu-btn"
          icon={<MenuOutlined />}
          aria-label="Open navigation menu"
          onClick={onOpenMobileSidebar}
        />
        <Title level={4} className="merfit-header-title">
          Dashboard
        </Title>
      </div>

      <div className="merfit-header-right">
        <RangePicker
          className="merfit-header-range"
          defaultValue={defaultRange}
          format="DD MMM YYYY"
          onChange={onDateRangeChange}
          allowClear={false}
        />

        <Tooltip
          title={
            mode === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          <span className="merfit-theme-toggle">
            <SunOutlined className="merfit-theme-toggle-icon" />
            <Switch
              checked={mode === "dark"}
              onChange={toggleMode}
              aria-label="Toggle dark mode"
            />
            <MoonOutlined className="merfit-theme-toggle-icon" />
          </span>
        </Tooltip>

        <Tooltip title="Notifications">
          <Badge count={3} size="small" offset={[-2, 2]}>
            <Button
              type="text"
              shape="circle"
              icon={<BellOutlined />}
              aria-label="Notifications"
              className="merfit-header-icon-btn"
            />
          </Badge>
        </Tooltip>

        <Dropdown
          menu={{ items: profileMenuItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Space className="merfit-header-profile" size={8}>
            <Avatar size={36} style={{ backgroundColor: "#2F6FED" }}>
              A
            </Avatar>
            <span className="merfit-header-profile-name">Admin</span>
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
}
