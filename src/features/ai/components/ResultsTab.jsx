import React, { useState } from "react";
import dayjs from "dayjs";
import { SectionCard, DataTable, EntityCell } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { aiService } from "../services/aiService";
import ResultDetailDrawer from "./ResultDetailDrawer";

export default function ResultsTab() {
  const {
    rows, total, loading, page, pageSize, setPage, setPageSize,
  } = useListQuery(aiService.getResults, { requestId: undefined });
  const [detailState, setDetailState] = useState({ open: false, result: null, loading: false });

  const handleView = async (record) => {
    setDetailState({ open: true, result: null, loading: true });
    const detail = await aiService.getResultById(record.id);
    setDetailState({ open: true, result: detail.data, loading: false });
  };

  const columns = [
    {
      title: "Kullanıcı",
      key: "user",
      width: 240,
      render: (_, r) => <EntityCell title={r.userEmail} subtitle={`İstek #${r.requestId}`} avatarColor="#22C55E" />,
    },
    {
      title: "Oluşturulma Tarihi",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 170,
      render: (v) => dayjs(v).format("DD MMM YYYY, HH:mm"),
    },
  ];

  return (
    <div className="merfit-page" style={{ gap: 20 }}>
      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={600}
          emptyDescription="Henüz yapay zeka sonucu yok."
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

      <ResultDetailDrawer
        open={detailState.open}
        result={detailState.result}
        loading={detailState.loading}
        onClose={() => setDetailState({ open: false, result: null, loading: false })}
      />
    </div>
  );
}
