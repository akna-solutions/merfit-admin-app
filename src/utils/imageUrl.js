// Görsel URL'lerini önizleme için sınıflandırır. Yalnızca gösterim içindir:
// formdan gönderilen imageUrl değerine hiçbir zaman dokunmaz.
//
//   { status: "empty" }            -> null, undefined, "" veya yalnızca boşluk
//   { status: "invalid" }          -> http(s) olarak çözülemeyen değer
//   { status: "valid", url }       -> kırpılmış, istek atılabilir URL
export function resolveImageUrl(value) {
  if (typeof value !== "string") return { status: "empty" };
  const trimmed = value.trim();
  if (!trimmed) return { status: "empty" };
  try {
    const parsed = new URL(trimmed);
    if ((parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.hostname) {
      return { status: "valid", url: trimmed };
    }
  } catch {
    // new URL() geçersiz girdide hata fırlatır; aşağıda "invalid" döner.
  }
  return { status: "invalid" };
}

// Tablo küçük resimleri gibi yalnızca geçerli URL'nin işe yaradığı yerler için kısayol.
export function previewableImageUrl(value) {
  const resolved = resolveImageUrl(value);
  return resolved.status === "valid" ? resolved.url : undefined;
}
