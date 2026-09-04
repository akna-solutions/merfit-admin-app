import React from "react";
import { Card, Row, Col, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

// Consistent filter row standard (spec §23): a Card holding filter controls
// laid out in a responsive grid, plus a Reset action. Pages pass their own
// filter inputs as `children` (each already wrapped in a <Col>) so filter
// composition stays page-specific while the shell / spacing / reset button
// stay identical everywhere.
export default function FilterBar({ children, onReset, extra }) {
  return (
    <Card className="merfit-filter-bar" bordered={false}>
      <Row gutter={[12, 12]} align="middle">
        {children}
        <Col flex="none" className="merfit-filter-bar-actions">
          <Button icon={<ReloadOutlined />} onClick={onReset}>
            Sıfırla
          </Button>
          {extra}
        </Col>
      </Row>
    </Card>
  );
}
