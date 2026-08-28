import React, { useMemo } from "react";
import { Layout, Menu, Drawer } from "antd";
import { LogoutOutlined, ThunderboltFilled } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import {
  navigationItems,
  navigationSections,
} from "../../routes/navigationConfig";
import { useThemeMode } from "../../theme/ThemeContext";

const { Sider } = Layout;

// Builds the Ant Design <Menu> items tree (with section groups) from the
// central navigationItems config, so sidebar structure only needs to be
// edited in one place (routes/navigationConfig.js).
function buildMenuItems(navigate) {
  return navigationSections.map((section) => {
    const itemsInSection = navigationItems.filter(
      (item) => item.section === section,
    );
    return {
      type: "group",
      key: `group-${section}`,
      label: section,
      children: itemsInSection.map((item) => {
        const Icon = item.icon;
        return {
          key: item.key,
          icon: <Icon />,
          label: item.label,
          onClick: () => navigate(item.path),
        };
      }),
    };
  });
}

function SidebarBrand({ collapsed }) {
  return (
    <div className="merfit-sidebar-brand">
      <span className="merfit-sidebar-brand-mark">
        <ThunderboltFilled />
      </span>
      {!collapsed && <span className="merfit-sidebar-brand-text">MERFIT</span>}
    </div>
  );
}

function SidebarContent({ collapsed, onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKey = useMemo(() => {
    const match = navigationItems.find(
      (item) => item.path === location.pathname,
    );
    return match ? [match.key] : ["dashboard"];
  }, [location.pathname]);

  const menuItems = useMemo(
    () =>
      buildMenuItems((path) => {
        navigate(path);
        onNavigate?.();
      }),
    [navigate, onNavigate],
  );

  return (
    <div className="merfit-sidebar-inner">
      <SidebarBrand collapsed={collapsed} />
      <div className="merfit-sidebar-menu-scroll">
        <Menu
          mode="inline"
          selectedKeys={selectedKey}
          items={menuItems}
          className="merfit-sidebar-menu"
        />
      </div>
      <div className="merfit-sidebar-footer">
        <Menu
          mode="inline"
          selectable={false}
          className="merfit-sidebar-menu merfit-sidebar-signout"
          items={[
            {
              key: "sign-out",
              icon: <LogoutOutlined />,
              label: "Sign Out",
            },
          ]}
        />
      </div>
    </div>
  );
}

export default function AdminSidebar({ collapsed, mobileOpen, onCloseMobile }) {
  const { mode } = useThemeMode();

  return (
    <>
      {/* Desktop / tablet: persistent collapsible sider */}
      <Sider
        className="merfit-sidebar merfit-sidebar-desktop"
        width={248}
        collapsedWidth={80}
        collapsed={collapsed}
        trigger={null}
        theme={mode === "dark" ? "dark" : "light"}
      >
        <SidebarContent collapsed={collapsed} />
      </Sider>

      {/* Mobile: drawer overlay, doesn't force the fixed desktop layout */}
      <Drawer
        placement="left"
        closable={false}
        open={mobileOpen}
        onClose={onCloseMobile}
        width={264}
        className="merfit-sidebar-drawer"
        styles={{ body: { padding: 0 } }}
      >
        <SidebarContent collapsed={false} onNavigate={onCloseMobile} />
      </Drawer>
    </>
  );
}
