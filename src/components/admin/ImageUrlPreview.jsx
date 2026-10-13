import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { PictureOutlined, WarningOutlined, FileExclamationOutlined } from "@ant-design/icons";
import { resolveImageUrl } from "../../utils/imageUrl";

// Görsel URL'si taşıyan her kayıt (antrenman, egzersiz, besin, içerik, ödül,
// kategori...) için ortak önizleme kutusu. Kutunun boyutu sabittir; görsel
// yüklenirken, yüklenemediğinde ya da URL boş/geçersizken aynı alanı kaplar,
// böylece formlarda ve detay ekranlarında yerleşim kaymaz.

// URL yazılırken her tuşta yeni istek atılmasın diye değeri geciktirir. Boş
// alandan dolu değere (düzenleme formunun ilk açılışı, yapıştırma) ve doludan
// boşa geçiş beklemeden uygulanır; yalnızca dolu bir URL'nin düzenlenmesi beklenir.
function useDebouncedUrl(url, delay) {
  const [applied, setApplied] = useState(url);

  useEffect(() => {
    if (url === applied) return undefined;
    const fromEmpty = resolveImageUrl(applied).status === "empty";
    const toEmpty = resolveImageUrl(url).status === "empty";
    if (!delay || fromEmpty || toEmpty) {
      setApplied(url);
      return undefined;
    }
    const timer = setTimeout(() => setApplied(url), delay);
    return () => clearTimeout(timer);
  }, [url, applied, delay]);

  return applied;
}

function PreviewState({ icon, text, tone, compact }) {
  return (
    <div className={`mbfit-image-preview-state${tone ? ` is-${tone}` : ""}`} role="img" aria-label={text} title={text}>
      {icon}
      {!compact && <span>{text}</span>}
    </div>
  );
}

// URL her değiştiğinde key ile yeniden oluşturulur; yükleme durumu böylece
// ayrı bir sıfırlama mantığına gerek kalmadan yeni URL'ye ait olur.
function PreviewImage({ url, alt, fit, linkToOriginal, compact }) {
  const [state, setState] = useState("loading");

  const img = (
    <img
      src={url}
      alt={alt}
      className={`mbfit-image-preview-img${state === "loaded" ? "" : " is-hidden"}`}
      style={{ objectFit: fit }}
      onLoad={() => setState("loaded")}
      onError={() => setState("error")}
    />
  );

  return (
    <>
      {state === "loading" && (
        <div className="mbfit-image-preview-state" aria-label="Görsel yükleniyor" role="img">
          <Spin size="small" />
        </div>
      )}
      {state === "error" && (
        <PreviewState
          icon={<FileExclamationOutlined />}
          text="Görsel yüklenemedi"
          tone="error"
          compact={compact}
        />
      )}
      {/* Bağlantı sarmalayıcısı yükleme bitince eklenmez, baştan vardır: aksi halde
          React <img>'i yeniden oluşturur ve görsel ikinci kez istenir. */}
      {state !== "error" &&
        (linkToOriginal ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title="Görseli yeni sekmede aç"
            className={`mbfit-image-preview-link${state === "loaded" ? "" : " is-pending"}`}
            tabIndex={state === "loaded" ? undefined : -1}
            aria-hidden={state === "loaded" ? undefined : true}
          >
            {img}
          </a>
        ) : (
          img
        ))}
    </>
  );
}

export default function ImageUrlPreview({
  url,
  alt = "Görsel önizlemesi",
  width = "100%",
  height = 160,
  fit = "contain",
  debounceMs = 0,
  emptyText = "Görsel yok",
  linkToOriginal = true,
  compact = false,
  className,
  style,
}) {
  const appliedUrl = useDebouncedUrl(url, debounceMs);
  const resolved = resolveImageUrl(appliedUrl);

  return (
    <div
      className={`mbfit-image-preview${className ? ` ${className}` : ""}`}
      style={{ width, height, ...style }}
    >
      {resolved.status === "empty" && (
        <PreviewState icon={<PictureOutlined />} text={emptyText} compact={compact} />
      )}
      {resolved.status === "invalid" && (
        <PreviewState icon={<WarningOutlined />} text="Geçerli bir görsel URL'si değil" tone="warning" compact={compact} />
      )}
      {resolved.status === "valid" && (
        <PreviewImage
          key={resolved.url}
          url={resolved.url}
          alt={alt}
          fit={fit}
          linkToOriginal={linkToOriginal}
          compact={compact}
        />
      )}
    </div>
  );
}
