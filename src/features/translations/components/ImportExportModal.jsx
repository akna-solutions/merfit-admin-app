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
    <Modal open={open} onCancel={onClose} footer={null} title="Çevirileri İçe / Dışa Aktar">
      <Paragraph type="secondary">
        Toplu içe ve dışa aktarma, dil başına bir JSON veya CSV dosyası okuyup yazacak ve
        gerçek <Text code>POST /api/admin/translations/import</Text> uç noktasına ekleyip güncelleyecek.
      </Paragraph>
      <Space direction="vertical" style={{ width: "100%" }} size={16}>
        <Upload.Dragger disabled multiple={false} style={{ padding: 12 }}>
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">İçe aktarmak için bir çeviri dosyasını tıklayın veya sürükleyin</p>
          <p className="ant-upload-hint">Yakında — dil başına JSON / CSV</p>
        </Upload.Dragger>
        <Button icon={<DownloadOutlined />} disabled block>
          Geçerli tabloyu dışa aktar (yakında)
        </Button>
      </Space>
    </Modal>
  );
}
