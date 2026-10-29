import React, { useState } from "react";
import { App, Button, Col, Input, Select, Space, Tag, Typography } from "antd";
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, InboxOutlined, PlusOutlined, SearchOutlined, StopOutlined } from "@ant-design/icons";
import { DataTable, EntityCell, FilterBar, RowActions, SectionCard, StatusTag } from "../../../components/admin";
import { previewableImageUrl } from "../../../utils/imageUrl";
import { useApiAction } from "../../notifications/hooks/useApiAction";
import { useSafeListQuery } from "../hooks/useSafeListQuery";
import { storeProductService } from "../services/storeService";
import { formatMoney } from "../utils/storeLabels";
import ListError from "./ListError";
import ProductFormDrawer from "./ProductFormDrawer";
import StockAdjustModal from "./StockAdjustModal";

const LOW_STOCK = 5;
const DEFAULT_FILTERS = { search: "", categoryId: undefined, isActive: undefined, stock: undefined, sortBy: undefined, sortDirection: undefined };

// "stock" filtresi tek seçicide tutulur; API'de outOfStock / lowStockThreshold olarak gider.
const mapFilters = ({ stock, ...rest }) => ({
  ...rest,
  outOfStock: stock === "out" ? true : stock === "in" ? false : undefined,
  lowStockThreshold: stock === "low" ? LOW_STOCK : undefined,
});

export default function ProductsTab({ categories }) {
  const { message } = App.useApp();
  const run = useApiAction();
  const { rows, total, loading, error, filters, page, pageSize, setPage, setPageSize, updateFilters, resetFilters, refetch } = useSafeListQuery(
    storeProductService.getProducts,
    DEFAULT_FILTERS,
    20,
    mapFilters,
  );
  const [formState, setFormState] = useState({ open: false, item: null });
  const [stockProduct, setStockProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const openEdit = async (record) => {
    // Liste satırı açıklama/varyant içermez; düzenlemeden önce tam kayıt alınır.
    const result = await run(() => storeProductService.getProduct(record.id));
    if (result && result.data) setFormState({ open: true, item: result.data });
  };

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    const item = formState.item;
    const result = await run(
      () => (item ? storeProductService.updateProduct(item.id, payload) : storeProductService.createProduct(payload)),
      item ? "Ürün güncellendi." : "Ürün eklendi.",
    );
    setSubmitting(false);
    if (result) {
      setFormState({ open: false, item: null });
      refetch();
    }
  };

  const handleStock = async ({ delta, note }) => {
    setSubmitting(true);
    const result = await run(() => storeProductService.adjustStock(stockProduct.id, { delta, note }), (r) => `Yeni stok: ${r.data.stockQuantity}`);
    setSubmitting(false);
    if (result) {
      setStockProduct(null);
      refetch();
    }
  };

  const handleToggle = async (record) => {
    const result = await run(() => storeProductService.updateStatus(record.id, { isActive: !record.isActive }));
    if (result) {
      message.success(`"${record.name}" ${record.isActive ? "satıştan kaldırıldı" : "satışa açıldı"}.`);
      refetch();
    }
  };

  const handleDelete = async (record) => {
    const result = await run(() => storeProductService.deleteProduct(record.id), `"${record.name}" silindi.`);
    if (result) refetch();
  };

  const onTableChange = (_, __, sorter) => {
    const field = sorter?.order ? sorter.columnKey : undefined;
    if (field !== filters.sortBy || (sorter?.order === "descend" ? "desc" : "asc") !== filters.sortDirection) {
      updateFilters({ sortBy: field, sortDirection: field ? (sorter.order === "descend" ? "desc" : "asc") : undefined });
    }
  };

  const sortOrderFor = (key) => (filters.sortBy === key ? (filters.sortDirection === "desc" ? "descend" : "ascend") : null);

  const columns = [
    {
      title: "Ürün",
      key: "name",
      width: 300,
      sorter: true,
      sortOrder: sortOrderFor("name"),
      render: (_, r) => (
        <EntityCell avatar={previewableImageUrl(r.imageUrl)} avatarShape="square" title={r.name} subtitle={`${r.brand} · ${r.sku}`} avatarColor="#2F6FED" />
      ),
    },
    { title: "Kategori", dataIndex: "categoryName", width: 150 },
    {
      title: "Fiyat",
      key: "price",
      width: 150,
      sorter: true,
      sortOrder: sortOrderFor("price"),
      render: (_, r) =>
        r.discountPrice ? (
          <Space direction="vertical" size={0}>
            <strong>{formatMoney(r.discountPrice)}</strong>
            <Typography.Text delete type="secondary" style={{ fontSize: 12 }}>
              {formatMoney(r.price)}
            </Typography.Text>
          </Space>
        ) : (
          formatMoney(r.price)
        ),
    },
    {
      title: "Stok",
      key: "stock",
      width: 100,
      sorter: true,
      sortOrder: sortOrderFor("stock"),
      render: (_, r) => <Tag color={r.stockQuantity === 0 ? "red" : r.stockQuantity <= LOW_STOCK ? "orange" : "default"}>{r.stockQuantity}</Tag>,
    },
    {
      title: "Durum",
      key: "status",
      width: 160,
      render: (_, r) => (
        <Space size={4} wrap>
          <StatusTag status={r.isActive ? "active" : "inactive"}>{r.isActive ? "Satışta" : "Pasif"}</StatusTag>
          {r.isFeatured && <Tag color="gold">Öne çıkan</Tag>}
        </Space>
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
            { key: "edit", label: "Düzenle", icon: <EditOutlined />, onClick: () => openEdit(record) },
            { key: "stock", label: "Stok düzelt", icon: <InboxOutlined />, onClick: () => setStockProduct(record) },
            {
              key: "toggle",
              label: record.isActive ? "Satıştan kaldır" : "Satışa aç",
              icon: record.isActive ? <StopOutlined /> : <CheckCircleOutlined />,
              onClick: () => handleToggle(record),
            },
            {
              key: "delete",
              label: "Sil",
              icon: <DeleteOutlined />,
              danger: true,
              confirm: `"${record.name}" silinsin mi? Siparişlerde geçen ürün silinemez; satıştan kaldırın.`,
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
            Ürün Ekle
          </Button>
        }
      >
        <Col xs={24} sm={12} lg={7}>
          <Input
            allowClear
            placeholder="Ad, marka veya SKU"
            prefix={<SearchOutlined />}
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
          />
        </Col>
        <Col xs={12} sm={6} lg={5}>
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            style={{ width: "100%" }}
            placeholder="Tüm kategoriler"
            value={filters.categoryId}
            onChange={(v) => updateFilters({ categoryId: v })}
            options={categories.map((c) => ({ value: c.id, label: c.parentCategoryName ? `${c.parentCategoryName} / ${c.name}` : c.name }))}
            aria-label="Kategori"
          />
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Select
            style={{ width: "100%" }}
            value={filters.isActive === undefined ? "all" : String(filters.isActive)}
            onChange={(v) => updateFilters({ isActive: v === "all" ? undefined : v === "true" })}
            options={[
              { value: "all", label: "Tüm durumlar" },
              { value: "true", label: "Satışta" },
              { value: "false", label: "Pasif" },
            ]}
            aria-label="Satış durumu"
          />
        </Col>
        <Col xs={12} sm={6} lg={4}>
          <Select
            style={{ width: "100%" }}
            value={filters.stock ?? "all"}
            onChange={(v) => updateFilters({ stock: v === "all" ? undefined : v })}
            options={[
              { value: "all", label: "Tüm stoklar" },
              { value: "in", label: "Stokta" },
              { value: "low", label: `Az stok (≤${LOW_STOCK})` },
              { value: "out", label: "Tükendi" },
            ]}
            aria-label="Stok"
          />
        </Col>
      </FilterBar>

      <SectionCard>
        <ListError error={error} onRetry={refetch} />
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={1000}
          emptyDescription={error ? "Liste yüklenemedi." : "Henüz ürün yok veya filtrelerle eşleşen ürün bulunamadı."}
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: (nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            },
          }}
          onChange={onTableChange}
        />
      </SectionCard>

      <ProductFormDrawer
        open={formState.open}
        item={formState.item}
        categories={categories}
        submitting={submitting}
        onClose={() => setFormState({ open: false, item: null })}
        onSubmit={handleSubmit}
      />
      <StockAdjustModal product={stockProduct} submitting={submitting} onClose={() => setStockProduct(null)} onSubmit={handleStock} />
    </>
  );
}
