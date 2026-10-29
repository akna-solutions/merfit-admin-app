import React, { useState } from "react";
import { App, Button, Col, Input, Select, Tag } from "antd";
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, StopOutlined } from "@ant-design/icons";
import { DataTable, EntityCell, FilterBar, RowActions, SectionCard, StatusTag } from "../../../components/admin";
import { previewableImageUrl } from "../../../utils/imageUrl";
import { useApiAction } from "../../notifications/hooks/useApiAction";
import { useSafeListQuery } from "../hooks/useSafeListQuery";
import { storeCategoryService } from "../services/storeService";
import CategoryFormDrawer from "./CategoryFormDrawer";
import ListError from "./ListError";

const DEFAULT_FILTERS = { search: "", isActive: undefined };

export default function CategoriesTab({ categories, onCategoriesChanged }) {
  const { message } = App.useApp();
  const run = useApiAction();
  const { rows, total, loading, error, filters, page, pageSize, setPage, setPageSize, updateFilters, resetFilters, refetch } = useSafeListQuery(
    storeCategoryService.getCategories,
    DEFAULT_FILTERS,
    50,
  );
  const [formState, setFormState] = useState({ open: false, item: null });
  const [submitting, setSubmitting] = useState(false);

  const changed = () => {
    refetch();
    onCategoriesChanged?.();
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    const item = formState.item;
    const result = await run(
      () => (item ? storeCategoryService.updateCategory(item.id, payload) : storeCategoryService.createCategory(payload)),
      item ? "Kategori güncellendi." : "Kategori eklendi.",
    );
    setSubmitting(false);
    if (result) {
      setFormState({ open: false, item: null });
      changed();
    }
  };

  const handleToggle = async (record) => {
    const result = await run(() => storeCategoryService.updateStatus(record.id, { isActive: !record.isActive }));
    if (result) {
      message.success(`"${record.name}" ${record.isActive ? "pasife alındı" : "aktifleştirildi"}.`);
      changed();
    }
  };

  const handleDelete = async (record) => {
    const result = await run(() => storeCategoryService.deleteCategory(record.id), `"${record.name}" silindi.`);
    if (result) changed();
  };

  const columns = [
    {
      title: "Kategori",
      key: "name",
      width: 280,
      render: (_, r) => <EntityCell avatar={previewableImageUrl(r.imageUrl)} avatarShape="square" title={r.name} subtitle={r.slug} avatarColor="#2F6FED" />,
    },
    { title: "Üst kategori", dataIndex: "parentCategoryName", width: 160, render: (v) => (v ? <Tag>{v}</Tag> : "—") },
    { title: "Ürün", dataIndex: "productCount", width: 80 },
    { title: "Sıra", dataIndex: "sortOrder", width: 80 },
    {
      title: "Durum",
      key: "isActive",
      width: 110,
      render: (_, r) => <StatusTag status={r.isActive ? "active" : "inactive"}>{r.isActive ? "Aktif" : "Pasif"}</StatusTag>,
    },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, record) => (
        <RowActions
          items={[
            { key: "edit", label: "Düzenle", icon: <EditOutlined />, onClick: () => setFormState({ open: true, item: record }) },
            {
              key: "toggle",
              label: record.isActive ? "Pasife al" : "Aktifleştir",
              icon: record.isActive ? <StopOutlined /> : <CheckCircleOutlined />,
              onClick: () => handleToggle(record),
            },
            {
              key: "delete",
              label: "Sil",
              icon: <DeleteOutlined />,
              danger: true,
              confirm: `"${record.name}" silinsin mi? Ürünü veya alt kategorisi olan kategori silinemez.`,
              onClick: () => handleDelete(record),
            },
          ]}
        />
      ),
    },
  ];

  return (
    <>
      <FilterBar
        onReset={resetFilters}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, item: null })}>
            Kategori Ekle
          </Button>
        }
      >
        <Col xs={24} sm={12} lg={8}>
          <Input allowClear placeholder="Kategori ara" prefix={<SearchOutlined />} value={filters.search} onChange={(e) => updateFilters({ search: e.target.value })} />
        </Col>
        <Col xs={24} sm={12} lg={5}>
          <Select
            style={{ width: "100%" }}
            value={filters.isActive === undefined ? "all" : String(filters.isActive)}
            onChange={(v) => updateFilters({ isActive: v === "all" ? undefined : v === "true" })}
            options={[
              { value: "all", label: "Tüm durumlar" },
              { value: "true", label: "Aktif" },
              { value: "false", label: "Pasif" },
            ]}
            aria-label="Durum"
          />
        </Col>
      </FilterBar>

      <SectionCard>
        <ListError error={error} onRetry={refetch} />
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={800}
          emptyDescription={error ? "Liste yüklenemedi." : "Henüz kategori yok."}
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
        item={formState.item}
        categories={categories}
        submitting={submitting}
        onClose={() => setFormState({ open: false, item: null })}
        onSubmit={handleSubmit}
      />
    </>
  );
}
