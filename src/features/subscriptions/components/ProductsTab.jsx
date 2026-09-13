import React, { useState } from "react";
import { Button, Typography, App } from "antd";
import { PlusOutlined, EditOutlined, StopOutlined, CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { SectionCard, DataTable, EntityCell, StatusTag, RowActions } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { subscriptionProductService } from "../services/subscriptionsService";
import ProductsFilterBar from "./ProductsFilterBar";
import ProductFormDrawer from "./ProductFormDrawer";

const { Text } = Typography;

const BILLING_PERIOD_LABELS = { Monthly: "Aylık", Yearly: "Yıllık" };

export default function ProductsTab() {
  const { message } = App.useApp();
  const {
    rows, total, loading, filters, page, pageSize,
    setPage, setPageSize, updateFilters, resetFilters, refetch,
  } = useListQuery(
    subscriptionProductService.getProducts,
    { search: "", billingPeriod: undefined, isActive: undefined },
  );
  const [formState, setFormState] = useState({ open: false, product: null });
  const [submitting, setSubmitting] = useState(false);

  const handleToggleStatus = async (record) => {
    await subscriptionProductService.updateStatus(record.id, { isActive: !record.isActive });
    message.success(`"${record.name}" artık ${!record.isActive ? "aktif" : "pasif"}.`);
    refetch();
  };

  const handleDelete = async (record) => {
    await subscriptionProductService.deleteProduct(record.id);
    message.success(`"${record.name}" silindi.`);
    refetch();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (formState.product) {
        await subscriptionProductService.updateProduct(formState.product.id, values);
        message.success("Ürün güncellendi.");
      } else {
        await subscriptionProductService.createProduct(values);
        message.success("Ürün oluşturuldu.");
      }
      setFormState({ open: false, product: null });
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "İsim",
      key: "name",
      width: 240,
      render: (_, r) => <EntityCell title={r.name} subtitle={r.code} avatarColor="#F5A623" />,
    },
    {
      title: "Faturalandırma Dönemi",
      dataIndex: "billingPeriod",
      key: "billingPeriod",
      width: 130,
      render: (v) => BILLING_PERIOD_LABELS[v] ?? v,
    },
    {
      title: "Fiyat",
      key: "price",
      width: 120,
      render: (_, r) => `${r.price.toFixed(2)} ${r.currency}`,
    },
    { title: "iOS Ürün Kimliği", dataIndex: "storeProductIdIos", key: "storeProductIdIos", width: 180, render: (v) => v ?? <Text type="secondary">—</Text> },
    { title: "Android Ürün Kimliği", dataIndex: "storeProductIdAndroid", key: "storeProductIdAndroid", width: 180, render: (v) => v ?? <Text type="secondary">—</Text> },
    {
      title: "Aktif",
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      render: (v) => <StatusTag status={v ? "Active" : "Inactive"}>{v ? "Aktif" : "Pasif"}</StatusTag>,
    },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, record) => (
        <RowActions
          items={[
            { key: "edit", label: "Düzenle", icon: <EditOutlined />, onClick: () => setFormState({ open: true, product: record }) },
            {
              key: "toggle",
              label: record.isActive ? "Pasifleştir" : "Aktifleştir",
              icon: record.isActive ? <StopOutlined /> : <CheckCircleOutlined />,
              onClick: () => handleToggleStatus(record),
            },
            {
              key: "delete",
              label: "Sil",
              icon: <DeleteOutlined />,
              danger: true,
              confirm: `"${record.name}" silinsin mi?`,
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
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, product: null })}>
          Ürün Oluştur
        </Button>
      </div>

      <ProductsFilterBar filters={filters} onChange={updateFilters} onReset={resetFilters} />

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={1100}
          emptyDescription="Bu filtrelere uyan ürün yok."
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

      <ProductFormDrawer
        open={formState.open}
        product={formState.product}
        submitting={submitting}
        onClose={() => setFormState({ open: false, product: null })}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
