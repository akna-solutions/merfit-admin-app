import React from "react";
import { Breadcrumb, Typography, Space } from "antd";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

// Shared page-header block used at the top of every admin screen
// (spec §3 Page Architecture / §33 Breadcrumb).
// crumbs: [{ label: "Dashboard", path: "/admin" }, { label: "Users" }]
export default function PageHeader({ crumbs, title, description, actions }) {
  const items = crumbs?.map((crumb) => ({
    title: crumb.path ? <Link to={crumb.path}>{crumb.label}</Link> : crumb.label,
  }));

  return (
    <div className="mbfit-page-header">
      {items?.length > 0 && (
        <Breadcrumb className="mbfit-page-breadcrumb" items={items} />
      )}
      <div className="mbfit-page-header-row">
        <div className="mbfit-page-header-text">
          <Title level={3} className="mbfit-page-title">
            {title}
          </Title>
          {description && (
            <Text type="secondary" className="mbfit-page-description">
              {description}
            </Text>
          )}
        </div>
        {actions && (
          <Space size={12} className="mbfit-page-header-actions" wrap>
            {actions}
          </Space>
        )}
      </div>
    </div>
  );
}
