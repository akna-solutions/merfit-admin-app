import React, { useState } from "react";
import { Col, Input, Select, Button, App } from "antd";
import { SearchOutlined, SaveOutlined, ImportOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { SectionCard, DataTable, FilterBar } from "../../../components/admin";
import { useTranslationGrid } from "../hooks/useTranslationGrid";
import EditableCell from "./EditableCell";
import ImportExportModal from "./ImportExportModal";

// The original TranslationsPage body (side-by-side resource-key editor),
// now hosted as a tab alongside the new Languages tab.
export default function TranslationGridTab() {
  const { message } = App.useApp();
  const {
    languages, languageAId, languageBId, setLanguageAId, setLanguageBId,
    search, setSearch, gridRows, loading, setCellValue, dirtyCount, saving, saveAll,
  } = useTranslationGrid();
  const [importOpen, setImportOpen] = useState(false);

  const languageA = languages.find((l) => l.id === languageAId);
  const languageB = languages.find((l) => l.id === languageBId);

  const handleSave = async () => {
    const result = await saveAll();
    message.success(
      `Saved — ${result.data.createdCount} created, ${result.data.updatedCount} updated.`,
    );
  };

  const columns = [
    { title: "Resource Key", dataIndex: "resourceKey", key: "resourceKey", width: 220 },
    {
      title: languageA ? languageA.name : "Language A",
      key: "valueA",
      width: 260,
      render: (_, record) => (
        <EditableCell
          value={record.valueA}
          languageId={languageAId}
          onChange={(value) => setCellValue(record.resourceKey, languageAId, value)}
        />
      ),
    },
    {
      title: languageB ? languageB.name : "Language B",
      key: "valueB",
      width: 260,
      render: (_, record) => (
        <EditableCell
          value={record.valueB}
          languageId={languageBId}
          onChange={(value) => setCellValue(record.resourceKey, languageBId, value)}
        />
      ),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 140,
      render: (v) => (v ? dayjs(v).format("DD MMM YYYY") : "—"),
    },
  ];

  return (
    <div className="merfit-page" style={{ gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button icon={<ImportOutlined />} onClick={() => setImportOpen(true)} style={{ marginRight: 8 }}>
          Import / Export
        </Button>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          disabled={dirtyCount === 0}
          loading={saving}
          onClick={handleSave}
        >
          Save Changes {dirtyCount > 0 ? `(${dirtyCount})` : ""}
        </Button>
      </div>

      <FilterBar onReset={() => setSearch("")}>
        <Col xs={12} sm={6} lg={5}>
          <Select
            style={{ width: "100%" }}
            value={languageAId}
            onChange={setLanguageAId}
            options={languages.map((l) => ({ value: l.id, label: l.name }))}
          />
        </Col>
        <Col xs={12} sm={6} lg={5}>
          <Select
            style={{ width: "100%" }}
            value={languageBId}
            onChange={setLanguageBId}
            options={languages.map((l) => ({ value: l.id, label: l.name }))}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Input
            allowClear
            placeholder="Search resource key"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </FilterBar>

      <SectionCard>
        <DataTable
          columns={columns}
          dataSource={gridRows}
          rowKey="resourceKey"
          loading={loading}
          scrollX={900}
          pagination={{ pageSize: 20 }}
          emptyDescription="No translation keys match this search."
        />
      </SectionCard>

      <ImportExportModal open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}
