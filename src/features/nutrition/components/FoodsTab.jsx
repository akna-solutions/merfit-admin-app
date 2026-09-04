import React, { useState } from "react";
import { Button, App } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { SectionCard, DataTable } from "../../../components/admin";
import { useFoods } from "../hooks/useFoods";
import { foodService } from "../services/nutritionService";
import { buildFoodsColumns } from "./foodsColumns";
import FoodsFilterBar from "./FoodsFilterBar";
import FoodFormDrawer from "./FoodFormDrawer";
import FoodDetailDrawer from "./FoodDetailDrawer";

export default function FoodsTab() {
  const { message } = App.useApp();
  const {
    rows, total, loading, filters, page, pageSize,
    setPage, setPageSize, updateFilters, resetFilters, refetch,
  } = useFoods();

  const [formState, setFormState] = useState({ open: false, food: null });
  const [submitting, setSubmitting] = useState(false);
  const [detailState, setDetailState] = useState({ open: false, food: null, loading: false });

  const handleView = async (record) => {
    setDetailState({ open: true, food: null, loading: true });
    const detail = await foodService.getFoodById(record.id);
    setDetailState({ open: true, food: detail.data, loading: false });
  };

  const handleEdit = (record) => setFormState({ open: true, food: record });

  const handleDelete = async (record) => {
    await foodService.deleteFood(record.id);
    message.success(`"${record.name}" silindi.`);
    refetch();
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (formState.food) {
        await foodService.updateFood(formState.food.id, values);
        message.success("Besin güncellendi.");
      } else {
        await foodService.createFood(values);
        message.success("Besin oluşturuldu.");
      }
      setFormState({ open: false, food: null });
      refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const columns = buildFoodsColumns({ onView: handleView, onEdit: handleEdit, onDelete: handleDelete });

  return (
    <div className="merfit-page" style={{ gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormState({ open: true, food: null })}>
          Besin Ekle
        </Button>
      </div>

      <FoodsFilterBar filters={filters} onChange={updateFilters} onReset={resetFilters} />

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={rows}
          loading={loading}
          scrollX={1000}
          emptyDescription="Bu filtrelere uyan besin bulunamadı."
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

      <FoodFormDrawer
        open={formState.open}
        food={formState.food}
        submitting={submitting}
        onClose={() => setFormState({ open: false, food: null })}
        onSubmit={handleSubmit}
      />

      <FoodDetailDrawer
        open={detailState.open}
        food={detailState.food}
        loading={detailState.loading}
        onClose={() => setDetailState({ open: false, food: null, loading: false })}
      />
    </div>
  );
}
