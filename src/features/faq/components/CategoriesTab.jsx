import React, { useState } from "react";
import { Button, App } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { SectionCard, DataTable, RowActions } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { faqCategoryService } from "../services/faqService";
import CategoryFormDrawer from "./CategoryFormDrawer";

export default function CategoriesTab() {
  const { message } = App.useApp();
  const {
    rows, total, loading, page, pageSize, setPage, setPageSize, refetch,
  } = useListQuery(faqCategoryService.getCategories, { search: "" }, 50);

  const [formState, setFormState] = useState({ open: false, category: null });
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async (record) => {
    await faqCategoryService.deleteCategory(record.id);
    message.success(`"${record.name}" was deleted.`);
    refetch();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (formState.category) {
        await faqCategoryService.updateCategory(formState.category.id, values);
        message.success("Category updated.");
      } else {
        await faqCategoryService.createCategory(values);
        message.success("Category created.");
      }
      setFormState({ open: false, category: null });
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name", width: 240 },
    { title: "FAQ Count", dataIndex: "faqCount", key: "faqCount", width: 120 },
    { title: "Sort Order", dataIndex: "sortOrder", key: "sortOrder", width: 120 },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, record) => (
        <RowActions
          items={[
            { key: "edit", label: "Edit", icon: <EditOutlined />, onClick: () => setFormState({ open: true, category: record }) },
            {
              key: "delete",
              label: "Delete",
              icon: <DeleteOutlined />,
              danger: true,
              confirm: `Delete "${record.name}"? Its FAQs will also be removed.`,
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
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, category: null })}>
          Create Category
        </Button>
      </div>

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={600}
          emptyDescription="No FAQ categories yet."
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

      <CategoryFormDrawer
        open={formState.open}
        category={formState.category}
        submitting={submitting}
        onClose={() => setFormState({ open: false, category: null })}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
