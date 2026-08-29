import React, { useEffect, useState } from "react";
import { Button, Col, Select, App } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, ArrowUpOutlined, ArrowDownOutlined, StopOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { SectionCard, DataTable, StatusTag, RowActions, FilterBar } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { faqService, faqCategoryService } from "../services/faqService";
import FaqFormDrawer from "./FaqFormDrawer";

export default function FaqsTab() {
  const { message } = App.useApp();
  const {
    rows, total, loading, filters, page, pageSize,
    setPage, setPageSize, updateFilters, resetFilters, refetch,
  } = useListQuery(faqService.getFaqs, { search: "", categoryId: undefined, isActive: undefined });

  const [categories, setCategories] = useState([]);
  const [formState, setFormState] = useState({ open: false, faq: null });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    faqCategoryService.getCategories().then((res) => setCategories(res.data.items));
  }, []);

  const handleDelete = async (record) => {
    await faqService.deleteFaq(record.id);
    message.success("FAQ deleted.");
    refetch();
  };

  const handleToggleStatus = async (record) => {
    await faqService.updateStatus(record.id, { isActive: !record.isActive });
    message.success(`FAQ is now ${!record.isActive ? "active" : "inactive"}.`);
    refetch();
  };

  const handleMove = async (record, direction) => {
    const sorted = [...rows].sort((a, b) => a.sortOrder - b.sortOrder);
    const index = sorted.findIndex((f) => f.id === record.id);
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;
    const other = sorted[swapIndex];
    await faqService.reorder([
      { id: record.id, sortOrder: other.sortOrder },
      { id: other.id, sortOrder: record.sortOrder },
    ]);
    refetch();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (formState.faq) {
        await faqService.updateFaq(formState.faq.id, values);
        message.success("FAQ updated.");
      } else {
        await faqService.createFaq(values);
        message.success("FAQ created.");
      }
      setFormState({ open: false, faq: null });
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { title: "Question", dataIndex: "question", key: "question", width: 280 },
    { title: "Category", dataIndex: "categoryName", key: "categoryName", width: 180 },
    { title: "Sort Order", dataIndex: "sortOrder", key: "sortOrder", width: 100 },
    { title: "Status", dataIndex: "isActive", key: "isActive", width: 100, render: (v) => <StatusTag status={v ? "Active" : "Inactive"} /> },
    {
      title: "Reorder",
      key: "reorder",
      width: 100,
      render: (_, record) => (
        <>
          <Button size="small" type="text" icon={<ArrowUpOutlined />} onClick={() => handleMove(record, "up")} />
          <Button size="small" type="text" icon={<ArrowDownOutlined />} onClick={() => handleMove(record, "down")} />
        </>
      ),
    },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, record) => (
        <RowActions
          items={[
            { key: "edit", label: "Edit", icon: <EditOutlined />, onClick: () => setFormState({ open: true, faq: record }) },
            {
              key: "toggle",
              label: record.isActive ? "Deactivate" : "Activate",
              icon: record.isActive ? <StopOutlined /> : <CheckCircleOutlined />,
              onClick: () => handleToggleStatus(record),
            },
            {
              key: "delete",
              label: "Delete",
              icon: <DeleteOutlined />,
              danger: true,
              confirm: "Delete this FAQ?",
              onClick: () => handleDelete(record),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="merfit-page" style={{ gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, faq: null })}>
          Create FAQ
        </Button>
      </div>

      <FilterBar onReset={resetFilters}>
        <Col xs={24} sm={12} lg={8}>
          <Select
            style={{ width: "100%" }}
            value={filters.categoryId ?? "all"}
            onChange={(v) => updateFilters({ categoryId: v === "all" ? undefined : v })}
            options={[{ value: "all", label: "All categories" }, ...categories.map((c) => ({ value: c.id, label: c.name }))]}
          />
        </Col>
      </FilterBar>

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={900}
          emptyDescription="No FAQs match these filters."
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

      <FaqFormDrawer
        open={formState.open}
        faq={formState.faq}
        categories={categories}
        submitting={submitting}
        onClose={() => setFormState({ open: false, faq: null })}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
