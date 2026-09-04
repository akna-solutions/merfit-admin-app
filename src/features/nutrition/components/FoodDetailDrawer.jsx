import React from "react";
import { Descriptions, Skeleton } from "antd";
import dayjs from "dayjs";
import { DetailDrawer } from "../../../components/admin";

export default function FoodDetailDrawer({ open, food, loading, onClose }) {
  return (
    <DetailDrawer open={open} title="Besin Detayı" onClose={onClose}>
      {loading || !food ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Ad">{food.name}</Descriptions.Item>
          <Descriptions.Item label="Marka">{food.brand ?? "Jenerik"}</Descriptions.Item>
          <Descriptions.Item label="Barkod">{food.barcode ?? "—"}</Descriptions.Item>
          <Descriptions.Item label="Porsiyon">{food.servingSize} {food.servingUnit}</Descriptions.Item>
          <Descriptions.Item label="Kalori">{food.calories}</Descriptions.Item>
          <Descriptions.Item label="Protein">{food.protein} g</Descriptions.Item>
          <Descriptions.Item label="Karbonhidrat">{food.carbs} g</Descriptions.Item>
          <Descriptions.Item label="Yağ">{food.fat} g</Descriptions.Item>
          <Descriptions.Item label="Lif">{food.fiber ?? "—"} g</Descriptions.Item>
          <Descriptions.Item label="Şeker">{food.sugar ?? "—"} g</Descriptions.Item>
          <Descriptions.Item label="Sodyum">{food.sodium ?? "—"} mg</Descriptions.Item>
          <Descriptions.Item label="Oluşturulma Tarihi">{dayjs(food.createdAt).format("DD MMM YYYY")}</Descriptions.Item>
          <Descriptions.Item label="Güncellenme Tarihi">
            {food.updatedAt ? dayjs(food.updatedAt).format("DD MMM YYYY") : "—"}
          </Descriptions.Item>
        </Descriptions>
      )}
    </DetailDrawer>
  );
}
