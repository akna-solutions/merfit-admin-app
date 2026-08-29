import React from "react";
import { Modal, Upload, Button, Typography, Space } from "antd";
import { InboxOutlined, DownloadOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

// Placeholder UI for bulk import/export — intentionally not wired to a real
// file parser yet. AdminTranslationController does expose a real endpoint
// for this (POST /api/admin/translations/import, one language at a time),
// but turning an uploaded file into AdminImportTranslationsRequest.Items
// needs a file-parsing step that's out of scope for this pass.
export default function ImportExportModal({ open, onClose }) {
  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Import / Export Translations">
      <Paragraph type="secondary">
        Bulk import and export will read/write a JSON or CSV file per language,
        upserting into the real <Text code>POST /api/admin/translations/import</Text> endpoint.
      </Paragraph>
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        <Upload.Dragger disabled multiple={false} style={{ padding: 12 }}>
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">Click or drag a translation file to import</p>
          <p className="ant-upload-hint">Coming soon — JSON / CSV per language</p>
        </Upload.Dragger>
        <Button icon={<DownloadOutlined />} disabled block>
          Export current grid (coming soon)
        </Button>
      </Space>
    </Modal>
  );
}
