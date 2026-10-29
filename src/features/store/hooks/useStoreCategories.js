import { useCallback, useEffect, useState } from "react";
import { storeCategoryService } from "../services/storeService";

/** Seçicilerde kullanılan tüm kategoriler (en fazla 100; mağaza kategorileri bu sayının altında kalır). */
export function useStoreCategories() {
  const [categories, setCategories] = useState([]);
  const reload = useCallback(async () => {
    try {
      const response = await storeCategoryService.getCategories({ page: 1, pageSize: 100 });
      setCategories(response.data.items);
    } catch {
      setCategories([]);
    }
  }, []);
  useEffect(() => {
    reload();
  }, [reload]);
  return { categories, reload };
}
