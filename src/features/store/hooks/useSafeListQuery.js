import { useCallback, useState } from "react";
import { useListQuery } from "../../../utils/useListQuery";

/**
 * useListQuery'nin hata durumunu da tutan sürümü: liste yüklenemezse boş tablo yerine hata mesajı ve
 * "Tekrar dene" gösterilebilsin (yüklenemeyen veri "kayıt yok" gibi görünmesin).
 */
export function useSafeListQuery(fetchFn, defaultFilters, defaultPageSize, mapFilters = (f) => f) {
  const [error, setError] = useState(null);
  const safeFetch = useCallback(
    async (params) => {
      try {
        const response = await fetchFn(mapFilters(params));
        setError(null);
        return response;
      } catch (e) {
        setError(e.message || "Liste yüklenemedi.");
        return { data: { items: [], totalCount: 0 } };
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchFn],
  );
  const query = useListQuery(safeFetch, defaultFilters, defaultPageSize);
  return { ...query, error };
}
