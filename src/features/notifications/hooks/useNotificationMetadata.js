import { useEffect, useState } from "react";
import { notificationTemplateService } from "../services/notificationService";

const EMPTY = {
  types: [],
  campaignTypes: [],
  ruleKinds: [],
  segments: [],
  screens: [],
  placeholdersByType: {},
  largeAudienceThreshold: 1000,
  maxSelectedUsers: 5000,
  defaultTimeZone: "Europe/Istanbul",
};

/** Bildirim formlarinin ortak sabit listeleri (API'den, oturum boyunca onbellekli). */
export function useNotificationMetadata() {
  const [metadata, setMetadata] = useState(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    notificationTemplateService
      .getMetadata()
      .then((res) => active && setMetadata({ ...EMPTY, ...res.data }))
      .catch(() => {})
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { metadata, loading };
}
