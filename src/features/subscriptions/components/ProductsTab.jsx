import React, { useState } from "react";
import { Button, Typography, App } from "antd";
import { PlusOutlined, EditOutlined, StopOutlined, CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { SectionCard, DataTable, EntityCell, StatusTag, RowActions } from "../../../components/admin";
import { useListQuery } from "../../../utils/useListQuery";
import { subscriptionProductService } from "../services/subscriptionsService";
import ProductsFilterBar from "./ProductsFilterBar";
import ProductFormDrawer from "./ProductFormDrawer";

const { Text } = Typography;

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
    message.success(`"${record.name}" is now ${!record.isActive ? "active" : "inactive"}.`);
    refetch();
  };

  const handleDelete = async (record) => {
    await subscriptionProductService.deleteProduct(record.id);
    message.success(`"${record.name}" was deleted.`);
    refetch();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (formState.product) {
        await subscriptionProductService.updateProduct(formState.product.id, values);
        message.success("Product updated.");
      } else {
        await subscriptionProductService.createProduct(values);
        message.success("Product created.");
      }
      setFormState({ open: false, product: null });
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "Name",
      key: "name",
      width: 240,
      render: (_, r) => <EntityCell title={r.name} subtitle={r.code} avatarColor="#F5A623" />,
    },
    { title: "Billing Period", dataIndex: "billingPeriod", key: "billingPeriod", width: 130 },
    {
      title: "Price",
      key: "price",
      width: 120,
      render: (_, r) => `${r.price.toFixed(2)} ${r.currency}`,
    },
    { title: "iOS Product ID", dataIndex: "storeProductIdIos", key: "storeProductIdIos", width: 180, render: (v) => v ?? <Text type="secondary">—</Text> },
    { title: "Android Product ID", dataIndex: "storeProductIdAndroid", key: "storeProductIdAndroid", width: 180, render: (v) => v ?? <Text type="secondary">—</Text> },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      render: (v) => <StatusTag status={v ? "Active" : "Inactive"} />,
    },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 64,
      render: (_, record) => (
        <RowActions
          items={[
            { key: "edit", label: "Edit", icon: <EditOutlined />, onClick: () => setFormState({ open: true, product: record }) },
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
              confirm: `Delete "${record.name}"?`,
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
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, product: null })}>
          Create Product
        </Button>
      </div>

      <ProductsFilterBar filters={filters} onChange={updateFilters} onReset={resetFilters} />

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={1100}
          emptyDescription="No products match these filters."
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
