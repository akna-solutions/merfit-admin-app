import React, { useEffect, useState } from "react";
import { Image, Spin, Typography } from "antd";
import { storeReviewService } from "../services/storeService";

/**
 * Yorum fotoğrafı. Admin görsel ucu kimlik istediği için görsel fetch ile alınır ve nesne URL'si olarak
 * gösterilir (gizlenmiş/silinmiş yorumların fotoğrafları da incelenebilsin). Bileşen kaldırılınca URL serbest bırakılır.
 */
export default function ReviewImage({ reviewId, image, size = 96 }) {
  const [url, setUrl] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let objectUrl = null;
    let cancelled = false;
    setUrl(null);
    setFailed(false);
    storeReviewService
      .getImage(reviewId, image.id)
      .then((blob) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [reviewId, image.id]);

  const box = { width: size, height: size, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" };
  if (failed) {
    return (
      <div className="mbfit-image-preview" style={box} data-testid={`review-image-failed-${image.id}`}>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Yüklenemedi
        </Typography.Text>
      </div>
    );
  }
  if (!url) {
    return (
      <div className="mbfit-image-preview" style={box}>
        <Spin size="small" />
      </div>
    );
  }
  return (
    <Image
      src={url}
      width={size}
      height={size}
      style={{ objectFit: "cover", borderRadius: 12 }}
      alt={`Yorum fotoğrafı ${image.width}×${image.height}`}
      data-testid={`review-image-${image.id}`}
    />
  );
}
