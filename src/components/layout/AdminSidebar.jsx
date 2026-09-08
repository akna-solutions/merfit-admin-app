import React, { useMemo } from "react";
import { Layout, Menu, Drawer, ConfigProvider, theme as antdTheme } from "antd";
import { darkThemeTokens, sidebarForcedDarkComponents } from "../../theme/themeTokens";
import { LogoutOutlined, ThunderboltFilled } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import {
  navigationItems,
  navigationSections,
} from "../../routes/navigationConfig";
import { useThemeMode } from "../../theme/ThemeContext";
import { useAuth } from "../../features/auth/context/AuthContext";

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
        <img src={"https://kcxewftcfitahxefmuwz.supabase.co/storage/v1/object/public/mbfit/mbfit-logo-withoutback.png"} alt="Merfit" className="merfit-sidebar-logo" />
    </div>
  );
}

function SidebarContent({ collapsed, onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const selectedKey = useMemo(() => {
    // Exact match first (covers "/admin" for Dashboard exactly), then fall
    // back to the longest path prefix match so nested routes like
    // "/admin/users/123" still highlight "Users". Sorting by path length
    // means "/admin/users" wins over the bare "/admin" prefix.
    const exact = navigationItems.find(
      (item) => item.path === location.pathname,
    );
    if (exact) return [exact.key];

    const prefixMatches = navigationItems
      .filter(
        (item) =>
          item.path !== "/admin" &&
          location.pathname.startsWith(`${item.path}/`),
      )
      .sort((a, b) => b.path.length - a.path.length);

    return prefixMatches.length ? [prefixMatches[0].key] : ["dashboard"];
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
              label: "Çıkış Yap",
              onClick: () => {
                logout();
                navigate("/login", { replace: true });
              },
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
          <ConfigProvider
      theme={{
        algorithm: antdTheme.darkAlgorithm,
        token: darkThemeTokens,
        components: sidebarForcedDarkComponents,
      }}
    >
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
      </ConfigProvider>
    </>
  );
}
