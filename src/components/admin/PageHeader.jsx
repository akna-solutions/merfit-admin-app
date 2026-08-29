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
    <div className="merfit-page-header">
      {items?.length > 0 && (
        <Breadcrumb className="merfit-page-breadcrumb" items={items} />
      )}
      <div className="merfit-page-header-row">
        <div className="merfit-page-header-text">
          <Title level={3} className="merfit-page-title">
            {title}
          </Title>
          {description && (
            <Text type="secondary" className="merfit-page-description">
              {description}
            </Text>
          )}
        </div>
        {actions && (
          <Space size={12} className="merfit-page-header-actions" wrap>
            {actions}
          </Space>
        )}
      </div>
    </div>
  );
}
