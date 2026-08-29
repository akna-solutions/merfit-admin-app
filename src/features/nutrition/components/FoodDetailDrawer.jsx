import React from "react";
import { Descriptions, Skeleton } from "antd";
import dayjs from "dayjs";
import { DetailDrawer } from "../../../components/admin";

export default function FoodDetailDrawer({ open, food, loading, onClose }) {
  return (
    <DetailDrawer open={open} title="Food Detail" onClose={onClose}>
      {loading || !food ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Name">{food.name}</Descriptions.Item>
          <Descriptions.Item label="Brand">{food.brand ?? "Generic"}</Descriptions.Item>
          <Descriptions.Item label="Barcode">{food.barcode ?? "—"}</Descriptions.Item>
          <Descriptions.Item label="Serving">{food.servingSize} {food.servingUnit}</Descriptions.Item>
          <Descriptions.Item label="Calories">{food.calories}</Descriptions.Item>
          <Descriptions.Item label="Protein">{food.protein} g</Descriptions.Item>
          <Descriptions.Item label="Carbs">{food.carbs} g</Descriptions.Item>
          <Descriptions.Item label="Fat">{food.fat} g</Descriptions.Item>
          <Descriptions.Item label="Fiber">{food.fiber ?? "—"} g</Descriptions.Item>
          <Descriptions.Item label="Sugar">{food.sugar ?? "—"} g</Descriptions.Item>
          <Descriptions.Item label="Sodium">{food.sodium ?? "—"} mg</Descriptions.Item>
          <Descriptions.Item label="Created At">{dayjs(food.createdAt).format("DD MMM YYYY")}</Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {food.updatedAt ? dayjs(food.updatedAt).format("DD MMM YYYY") : "—"}
          </Descriptions.Item>
        </Descriptions>
      )}
    </DetailDrawer>
  );
}
