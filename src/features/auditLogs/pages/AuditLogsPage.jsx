import React, { useState } from "react";
import { Tag, Typography } from "antd";
import dayjs from "dayjs";
import { PageHeader, PageContainer, SectionCard, DataTable, EntityCell } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { auditLogService } from "../services/auditLogService";
import AuditLogsFilterBar from "../components/AuditLogsFilterBar";
import AuditLogDetailDrawer from "../components/AuditLogDetailDrawer";

const { Text } = Typography;

export default function AuditLogsPage() {
  const {
    rows, total, loading, filters, page, pageSize,
    setPage, setPageSize, updateFilters, resetFilters,
  } = useListQuery(
    auditLogService.getAuditLogs,
    { search: "", action: undefined, entity: undefined, dateRange: null },
  );
  const [detailState, setDetailState] = useState({ open: false, log: null, loading: false });

  const handleView = async (record) => {
    setDetailState({ open: true, log: null, loading: true });
    const detail = await auditLogService.getAuditLogById(record.id);
    setDetailState({ open: true, log: detail.data, loading: false });
  };

  const columns = [
    {
      title: "Timestamp",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: "descend",
      render: (v) => dayjs(v).format("DD MMM YYYY, HH:mm"),
    },
    {
      title: "Admin",
      key: "admin",
      width: 200,
      render: (_, r) =>
        r.adminEmail ? (
          <EntityCell title={r.adminEmail} avatarColor="#2F6FED" />
        ) : (
          <Text type="secondary">System</Text>
        ),
    },
    { title: "Action", dataIndex: "action", key: "action", width: 130, render: (v) => <Tag color="blue">{v}</Tag> },
    { title: "Entity", dataIndex: "entity", key: "entity", width: 160 },
    { title: "Entity ID", dataIndex: "entityId", key: "entityId", width: 100, render: (v) => v ?? "—" },
    { title: "IP Address", dataIndex: "ipAddress", key: "ipAddress", width: 140 },
  ];

  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: "Dashboard", path: "/admin" }, { label: "Audit Logs" }]}
        title="Audit Logs"
        description="Read-only trail of critical admin actions."
      />

      <AuditLogsFilterBar filters={filters} onChange={updateFilters} onReset={resetFilters} />

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={1000}
          emptyDescription="No audit log entries match these filters."
          onRow={(record) => ({ className: "merfit-row-clickable", onClick: () => handleView(record) })}
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

      <AuditLogDetailDrawer
        open={detailState.open}
        log={detailState.log}
        loading={detailState.loading}
        onClose={() => setDetailState({ open: false, log: null, loading: false })}
      />
    </PageContainer>
  );
}
