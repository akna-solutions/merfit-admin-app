import React, { useState } from "react";
import { Input, Typography } from "antd";

const { Text } = Typography;

// Click-to-edit cell for the translation grid. Edits are staged locally
// (via onChange) rather than saved per keystroke — the page's "Save
// Changes" button flushes everything through the real bulk-update endpoint
// in one request, matching AdminBulkUpdateTranslationsRequest's shape.
export default function EditableCell({ value, onChange, languageId }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (!languageId) return <Text type="secondary">—</Text>;

  if (editing) {
    return (
      <Input
        autoFocus
        size="small"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          setEditing(false);
          if (draft !== value) onChange(draft);
        }}
        onPressEnter={(e) => e.target.blur()}
      />
    );
  }

  return (
    <div
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      style={{ cursor: "pointer", minHeight: 22, padding: "2px 4px", borderRadius: 4 }}
      className="merfit-editable-cell"
    >
      {value || <Text type="secondary" italic>Click to add…</Text>}
    </div>
  );
}
