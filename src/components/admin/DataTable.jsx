import React from "react";
import { Table } from "antd";
import EmptyState from "./EmptyState";

const DEFAULT_PAGE_SIZE = 10;

// Standard admin table look (spec §22): compact, sticky header when
// scrollable, consistent pagination + empty state, horizontal scroll on
// small screens. Every feature table renders through this wrapper so
// behavior never drifts page to page.
export default function DataTable({
  columns,
  dataSource,
  rowKey = "id",
  loading,
  scrollX = 900,
  pagination,
  onRow,
  emptyDescription,
  size = "middle",
}) {
  return (
    <Table
      className="merfit-data-table"
      columns={columns}
      dataSource={dataSource}
      rowKey={rowKey}
      loading={loading}
      size={size}
      onRow={onRow}
      sticky
      scroll={{ x: scrollX }}
      locale={{
        emptyText: <EmptyState description={emptyDescription} />,
      }}
      pagination={
        pagination === false
          ? false
          : {
              pageSize: DEFAULT_PAGE_SIZE,
              showSizeChanger: true,
              showTotal: (total) => `${total} kayıt`,
              ...pagination,
            }
      }
    />
  );
}
