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
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import { useThemeMode } from "../../theme/ThemeContext";
import { navigationItems } from "../../routes/navigationConfig";
import { useAuth } from "../../features/auth/context/AuthContext";

const { Header } = Layout;
const { RangePicker } = DatePicker;
const { Title } = Typography;

// Resolves the current page title from the central nav config using the
// same longest-prefix-match logic as the sidebar, so header + sidebar
// never disagree about which section is active (spec §34).
function usePageTitle() {
  const { pathname } = useLocation();
  const exact = navigationItems.find((item) => item.path === pathname);
  if (exact) return exact.label;
  const prefixMatches = navigationItems
    .filter(
      (item) => item.path !== "/admin" && pathname.startsWith(`${item.path}/`),
    )
    .sort((a, b) => b.path.length - a.path.length);
  return prefixMatches.length ? prefixMatches[0].label : "Anasayfa";
}

function buildProfileMenuItems(navigate) {
  return [
    { key: "settings", icon: <SettingOutlined />, label: "Ayarlar", onClick: () => navigate("/admin/settings") },
    { type: "divider" },
    {
      key: "sign-out",
      icon: <LogoutOutlined />,
      label: "Çıkış Yap",
      danger: true,
    },
  ];
}

export default function AdminHeader({
  onOpenMobileSidebar,
  onDateRangeChange,
}) {
  const { mode, toggleMode } = useThemeMode();
  const pageTitle = usePageTitle();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleMenuClick = ({ key }) => {
    if (key === "sign-out") {
      logout();
      navigate("/login", { replace: true });
    }
  };

  const displayName = user?.name ?? user?.email ?? "Yönetici";
  const avatarInitial = displayName.charAt(0).toUpperCase();

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
          aria-label="Gezinme menüsünü aç"
          onClick={onOpenMobileSidebar}
        />
        <Title level={4} className="merfit-header-title">
          {pageTitle}
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
            mode === "dark" ? "Açık moda geç" : "Koyu moda geç"
          }
        >
          <span className="merfit-theme-toggle">
            <SunOutlined className="merfit-theme-toggle-icon" />
            <Switch
              checked={mode === "dark"}
              onChange={toggleMode}
              aria-label="Koyu modu aç/kapat"
            />
            <MoonOutlined className="merfit-theme-toggle-icon" />
          </span>
        </Tooltip>

        <Tooltip title="Bildirimler">
          <Badge count={3} size="small" offset={[-2, 2]}>
            <Button
              type="text"
              shape="circle"
              icon={<BellOutlined />}
              aria-label="Bildirimler"
              className="merfit-header-icon-btn"
            />
          </Badge>
        </Tooltip>

        <Dropdown
          menu={{ items: buildProfileMenuItems(navigate), onClick: handleMenuClick }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Space className="merfit-header-profile" size={8}>
            <Avatar size={36} style={{ backgroundColor: "#2F6FED" }}>
              {avatarInitial}
            </Avatar>
            <span className="merfit-header-profile-name">{displayName}</span>
          </Space>
        </Dropdown>
      </div>
    </Header>
  );
}
