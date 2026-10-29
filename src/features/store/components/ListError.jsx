import React from "react";
import { Alert, Button } from "antd";

/** Liste yüklenemediğinde boş tablo yerine gösterilir; "kayıt yok" ile karışmasın. */
export default function ListError({ error, onRetry }) {
  if (!error) return null;
  return (
    <Alert
      type="error"
      showIcon
      style={{ marginBottom: 12 }}
      message="Liste yüklenemedi"
      description={error}
      action={
        <Button size="small" onClick={onRetry}>
          Tekrar dene
        </Button>
      }
    />
  );
}
