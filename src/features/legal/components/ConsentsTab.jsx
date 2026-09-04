import React from "react";
import { Col, Input, Select, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { SectionCard, DataTable, EntityCell, FilterBar } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { consentService, LEGAL_DOCUMENT_TYPE_LABELS } from "../services/legalService";

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
      title: "Kullanıcı",
      key: "userEmail",
      width: 220,
      render: (_, r) => <EntityCell title={r.userEmail} subtitle={`Kullanıcı #${r.userId}`} avatarColor="#2F6FED" />,
    },
    {
      title: "Belge",
      key: "documentTitle",
      width: 240,
      render: (_, r) => <EntityCell title={r.documentTitle} subtitle={LEGAL_DOCUMENT_TYPE_LABELS[r.documentType] ?? r.documentType} avatarColor="#722ED1" />,
    },
    { title: "Sürüm", dataIndex: "version", key: "version", width: 100 },
    {
      title: "Onaylandı",
      dataIndex: "accepted",
      key: "accepted",
      width: 110,
      render: (v) => (v ? <Tag color="green">Onaylandı</Tag> : <Tag color="red">Reddedildi</Tag>),
    },
    {
      title: "Onay Tarihi",
      dataIndex: "acceptedAt",
      key: "acceptedAt",
      width: 160,
      render: (v) => dayjs(v).format("DD MMM YYYY HH:mm"),
    },
    {
      title: "IP Adresi",
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
            placeholder="Kullanıcı ID"
            value={filters.userId}
            onChange={(e) => updateFilters({ userId: e.target.value ? Number(e.target.value) : undefined })}
          />
        </Col>
        <Col xs={12} sm={8} lg={6}>
          <Select
            style={{ width: "100%" }}
            placeholder="Onaylandı mı?"
            allowClear
            value={filters.accepted}
            onChange={(v) => updateFilters({ accepted: v })}
            options={[{ value: true, label: "Onaylandı" }, { value: false, label: "Reddedildi" }]}
          />
        </Col>
      </FilterBar>

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={900}
          emptyDescription="Bu filtrelerle eşleşen onay kaydı yok."
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
