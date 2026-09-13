import React, { useEffect, useState } from "react";
import { Layout, Grid } from "antd";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const { Content } = Layout;
const { useBreakpoint } = Grid;

// Structural shell shared by every admin screen:
// <Layout><Sider/><Layout><Header/><Content/></Layout></Layout>
// Handles the desktop-collapse vs. mobile-drawer split so individual
// pages never need to know about sidebar responsiveness.
export default function AdminLayout() {
  const screens = useBreakpoint();
  const isDesktop = screens.lg;

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-collapse on tablet widths, auto-close the mobile drawer once we
  // cross back up to desktop so state doesn't get stuck mid-transition.
  useEffect(() => {
    if (!isDesktop) {
      setMobileOpen(false);
    }
  }, [isDesktop]);

  useEffect(() => {
    if (screens.lg && !screens.xl) {
      setCollapsed(true);
    } else if (screens.xl) {
      setCollapsed(false);
    }
  }, [screens.lg, screens.xl]);

  const handleOpenMobileSidebar = () => {
    if (isDesktop) {
      setCollapsed((prev) => !prev);
    } else {
      setMobileOpen(true);
    }
  };

  return (
    <Layout className="mbfit-admin-shell">
      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <Layout className="mbfit-admin-body">
        <AdminHeader onOpenMobileSidebar={handleOpenMobileSidebar} />
        <Content className="mbfit-admin-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
