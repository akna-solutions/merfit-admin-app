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
    message.success(`"${record.name}" silindi.`);
    refetch();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (formState.category) {
        await faqCategoryService.updateCategory(formState.category.id, values);
        message.success("Kategori güncellendi.");
      } else {
        await faqCategoryService.createCategory(values);
        message.success("Kategori oluşturuldu.");
      }
      setFormState({ open: false, category: null });
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { title: "Ad", dataIndex: "name", key: "name", width: 240 },
    { title: "SSS Sayısı", dataIndex: "faqCount", key: "faqCount", width: 120 },
    { title: "Sıra", dataIndex: "sortOrder", key: "sortOrder", width: 120 },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, record) => (
        <RowActions
          items={[
            { key: "edit", label: "Düzenle", icon: <EditOutlined />, onClick: () => setFormState({ open: true, category: record }) },
            {
              key: "delete",
              label: "Sil",
              icon: <DeleteOutlined />,
              danger: true,
              confirm: `"${record.name}" silinsin mi? Bu kategoriye ait SSS'ler de kaldırılacak.`,
              onClick: () => handleDelete(record),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="mbfit-page" style={{ gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, category: null })}>
          Kategori Oluştur
        </Button>
      </div>

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={600}
          emptyDescription="Henüz SSS kategorisi yok."
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
