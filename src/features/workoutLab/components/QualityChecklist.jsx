import React from "react";
import { Space, Tag, Typography } from "antd";
import { CheckCircleFilled, ExclamationCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import { SectionCard, EmptyState } from "../../../components/admin";
import { CHECK_STATUS_LABELS } from "../utils/labLabels";

const { Text, Paragraph } = Typography;

const ICONS = {
  Passed: <CheckCircleFilled style={{ color: "#52c41a" }} />,
  Warning: <ExclamationCircleFilled style={{ color: "#faad14" }} />,
  Failed: <CloseCircleFilled style={{ color: "#ff4d4f" }} />,
};
const TAG_COLORS = { Passed: "green", Warning: "gold", Failed: "red" };

// Açık kurallara dayanan laboratuvar kontrolleri (MerfitCustomerApi WorkoutPlanQualityChecker).
// Bilimsel bir puan değildir; her satır uygulanan kuralı gösterir.
export default function QualityChecklist({ checks }) {
  const items = checks ?? [];
  const counts = items.reduce((acc, c) => ({ ...acc, [c.status]: (acc[c.status] ?? 0) + 1 }), {});
  return (
    <SectionCard
      title="Kalite kontrolleri"
      extra={
        <Space size={4} wrap>
          {["Passed", "Warning", "Failed"].map((s) => (
            <Tag key={s} color={TAG_COLORS[s]}>{CHECK_STATUS_LABELS[s]}: {counts[s] ?? 0}</Tag>
          ))}
        </Space>
      }
    >
      <Paragraph type="secondary" style={{ marginTop: 0 }}>
        Bu kontroller açık kurallara dayanır ve bilimsel bir puan değildir. Programın beklenen kurallara uyup
        uymadığını hızlıca görmek içindir.
      </Paragraph>
      {items.length === 0 ? (
        <EmptyState description="Kontrol sonucu yok." />
      ) : (
        <div className="workout-lab-checks">
          {items.map((check) => (
            <div key={check.code} className="workout-lab-check" data-testid={`check-${check.code}`}>
              <Space align="start">
                {ICONS[check.status]}
                <div>
                  <Space wrap size={6}>
                    <Text strong>{check.title}</Text>
                    <Tag color={TAG_COLORS[check.status]}>{CHECK_STATUS_LABELS[check.status] ?? check.status}</Tag>
                  </Space>
                  <div>{check.message}</div>
                  {check.rule && <Text type="secondary" style={{ fontSize: 12 }}>Kural: {check.rule}</Text>}
                  {check.details?.length > 0 && (
                    <ul style={{ margin: "4px 0 0", paddingLeft: 18 }}>
                      {check.details.map((d, i) => <li key={i}><Text style={{ fontSize: 13 }}>{d}</Text></li>)}
                    </ul>
                  )}
                </div>
              </Space>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
