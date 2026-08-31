import React from "react";
import { Col, Input, Select, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { SectionCard, DataTable, EntityCell, FilterBar } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { consentService } from "../services/legalService";

const { Text } = Typography;

// GET /api/admin/user-consents — deliberately read-only per the API's own
// doc comment: "consent verileri admin tarafindan degistirilemez/silinemez".
export default function ConsentsTab() {
  const {
    rows, total, loading, filters, page, pageSize,
    setPage, setPageSize, updateFilters, resetFilters,
  } = useListQuery(consentService.getConsents, { userId: undefined, documentId: undefined, accepted: undefined });

  const columns = [
    {
      title: "User",
      key: "userEmail",
      width: 220,
      render: (_, r) => <EntityCell title={r.userEmail} subtitle={`User #${r.userId}`} avatarColor="#2F6FED" />,
    },
    {
      title: "Document",
      key: "documentTitle",
      width: 240,
      render: (_, r) => <EntityCell title={r.documentTitle} subtitle={r.documentType} avatarColor="#722ED1" />,
    },
    { title: "Version", dataIndex: "version", key: "version", width: 100 },
    {
      title: "Accepted",
      dataIndex: "accepted",
      key: "accepted",
      width: 110,
      render: (v) => (v ? <Tag color="green">Accepted</Tag> : <Tag color="red">Declined</Tag>),
    },
    {
      title: "Accepted At",
      dataIndex: "acceptedAt",
      key: "acceptedAt",
      width: 160,
      render: (v) => dayjs(v).format("DD MMM YYYY HH:mm"),
    },
    {
      title: "IP Address",
      dataIndex: "ipAddress",
      key: "ipAddress",
      width: 140,
      render: (v) => v || <Text type="secondary">—</Text>,
    },
  ];

  return (
    <div className="merfit-page" style={{ gap: 20 }}>
      <FilterBar onReset={resetFilters}>
        <Col xs={12} sm={8} lg={6}>
          <Input
            allowClear
            placeholder="User ID"
            value={filters.userId}
            onChange={(e) => updateFilters({ userId: e.target.value ? Number(e.target.value) : undefined })}
          />
        </Col>
        <Col xs={12} sm={8} lg={6}>
          <Select
            style={{ width: "100%" }}
            placeholder="Accepted?"
            allowClear
            value={filters.accepted}
            onChange={(v) => updateFilters({ accepted: v })}
            options={[{ value: true, label: "Accepted" }, { value: false, label: "Declined" }]}
          />
        </Col>
      </FilterBar>

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={900}
          emptyDescription="No consent records match these filters."
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: (nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            },
          }}
        />
      </SectionCard>
    </div>
  );
}
