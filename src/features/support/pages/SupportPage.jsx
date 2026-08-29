import React, { useState } from "react";
import dayjs from "dayjs";
import { PageHeader, PageContainer, SectionCard, DataTable, EntityCell, StatusTag } from "../../../components/admin";
import { Tag } from "antd";
import { useListQuery } from "../../../utils/useListQuery";
import { ticketService } from "../services/ticketService";
import TicketsFilterBar from "../components/TicketsFilterBar";
import TicketDetailDrawer from "../components/TicketDetailDrawer";

const PRIORITY_COLOR = { Low: "default", Medium: "blue", High: "orange", Urgent: "red" };

export default function SupportPage() {
  const {
    rows, total, loading, filters, page, pageSize,
    setPage, setPageSize, updateFilters, resetFilters, refetch,
  } = useListQuery(
    ticketService.getTickets,
    { search: "", status: undefined, priority: undefined, dateRange: null },
  );
  const [detailState, setDetailState] = useState({ open: false, ticket: null, loading: false });

  const handleView = async (record) => {
    setDetailState({ open: true, ticket: null, loading: true });
    const detail = await ticketService.getTicketById(record.id);
    setDetailState({ open: true, ticket: detail.data, loading: false });
  };

  const refreshDetail = async (closeDrawer = true) => {
    const detail = await ticketService.getTicketById(detailState.ticket.id);
    setDetailState({ open: !closeDrawer, ticket: detail.data, loading: false });
    refetch();
  };

  const columns = [
    { title: "Ticket ID", dataIndex: "id", key: "id", width: 90, render: (v) => `#${v}` },
    {
      title: "User",
      key: "user",
      width: 200,
      render: (_, r) => <EntityCell title={r.userEmail} subtitle={`#${r.userId}`} avatarColor="#2F6FED" />,
    },
    { title: "Subject", dataIndex: "subject", key: "subject", width: 220 },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      render: (v) => <Tag color={PRIORITY_COLOR[v]}>{v}</Tag>,
    },
    { title: "Status", dataIndex: "status", key: "status", width: 120, render: (v) => <StatusTag status={v} /> },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (v) => dayjs(v).format("DD MMM YYYY"),
    },
    {
      title: "Updated At",
      key: "updatedAt",
      width: 150,
      render: (_, r) => dayjs(r.closedAt ?? r.createdAt).format("DD MMM YYYY"),
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        crumbs={[{ label: "Dashboard", path: "/admin" }, { label: "Support" }]}
        title="Support"
        description="Manage user support tickets."
      />

      <TicketsFilterBar filters={filters} onChange={updateFilters} onReset={resetFilters} />

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={1000}
          emptyDescription="No support tickets match these filters."
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

      <TicketDetailDrawer
        open={detailState.open}
        ticket={detailState.ticket}
        loading={detailState.loading}
        onClose={() => setDetailState({ open: false, ticket: null, loading: false })}
        onChanged={refreshDetail}
      />
    </PageContainer>
  );
}
