import React from "react";
import { Alert } from "antd";
import { SectionCard } from "../../../components/admin";
import DispatchTable from "./DispatchTable";

/** Tum kaynaklardaki gonderim kayitlari: basarisiz gonderim incelemesi ve yeniden deneme. */
export default function DispatchesTab() {
  return (
    <div className="mbfit-page" style={{ gap: 16 }}>
      <Alert
        type="info"
        showIcon
        message="Her satır bir kullanıcıya giden bir bildirimdir. Push gönderimi arka planda yapılır; cihaz tokenları gösterilmez."
      />
      <SectionCard>
        <DispatchTable showSourceFilter />
      </SectionCard>
    </div>
  );
}
