import React from "react";
import { Input } from "antd";
import ImageUrlPreview from "./ImageUrlPreview";

// Form.Item içinde düz <Input> yerine kullanılır: Form.Item'ın verdiği
// value/onChange/id doğrudan Input'a geçer, yani gönderilen imageUrl değeri
// ve mevcut doğrulama kuralları aynen korunur; altındaki önizleme yalnızca
// o anki form değerini gösterir.
export default function ImageUrlInput({
  value,
  onChange,
  placeholder = "https://...",
  previewHeight = 160,
  previewAlt = "Görsel önizlemesi",
  debounceMs = 400,
  ...inputProps
}) {
  return (
    <div className="mbfit-image-url-input">
      <Input value={value} onChange={onChange} placeholder={placeholder} {...inputProps} />
      <ImageUrlPreview url={value} alt={previewAlt} height={previewHeight} debounceMs={debounceMs} />
    </div>
  );
}
